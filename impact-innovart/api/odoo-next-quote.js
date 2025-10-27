// api/odoo-next-quote.js
// Serverless function en Vercel (Node.js) que devuelve el siguiente folio desde Odoo.
// Requiere variables de entorno en Vercel:
// ODOO_URL, ODOO_DB, ODOO_USER, ODOO_PASSWORD, ODOO_SEQUENCE_CODE (ej. "sale.order")

export default async function handler(req, res) {
  try {
    const {
      ODOO_URL,
      ODOO_DB,
      ODOO_USER,
      ODOO_PASSWORD,
      ODOO_SEQUENCE_CODE = "sale.order",
    } = process.env;

    if (!ODOO_URL || !ODOO_DB || !ODOO_USER || !ODOO_PASSWORD) {
      return res.status(500).json({ error: "Faltan variables de entorno de Odoo." });
    }

    // 1) Autenticación (JSON-RPC)
    const authResp = await fetch(`${ODOO_URL}/web/session/authenticate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        params: { db: ODOO_DB, login: ODOO_USER, password: ODOO_PASSWORD },
      }),
    });

    const authJson = await authResp.json();
    if (!authJson.result) {
      return res.status(401).json({ error: "No se pudo autenticar en Odoo." });
    }

    // Tomamos la cookie de sesión para la llamada siguiente
    const setCookie = authResp.headers.get("set-cookie");
    const cookieHeader = setCookie ? setCookie.split(",").map(s => s.split(";")[0]).join("; ") : "";

    // 2) Llamar a ir.sequence.next_by_code para obtener el siguiente número
    const seqResp = await fetch(`${ODOO_URL}/web/dataset/call_kw`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "call",
        params: {
          model: "ir.sequence",
          method: "next_by_code",
          args: [ODOO_SEQUENCE_CODE],
          kwargs: {},
        },
      }),
    });

    const seqJson = await seqResp.json();
    if (!seqJson.result) {
      return res.status(500).json({ error: "No se pudo obtener el folio en Odoo." });
    }

    return res.status(200).json({ folio: seqJson.result });
  } catch (err) {
    return res.status(500).json({ error: String(err?.message || err) });
  }
}
