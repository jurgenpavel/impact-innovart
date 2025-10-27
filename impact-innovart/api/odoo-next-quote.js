// api/odoo-next-quote.js
// Serverless (Vercel, Node.js) para obtener el siguiente folio de Odoo.
// Requiere en Vercel:
//  - ODOO_URL       (e.g. https://www.eg-automation.com)
//  - ODOO_DB        (e.g. master_EG-Automation)
//  - ODOO_LOGIN     (usuario API, e.g. impact_api)
//  - ODOO_API_KEY   (tu API key, no la contraseña)
//  - (opcional) ODOO_SEQUENCE_CODE = "sale.order"

export default async function handler(req, res) {
  try {
    const {
      ODOO_URL,
      ODOO_DB,
      ODOO_LOGIN,
      ODOO_API_KEY,
      ODOO_SEQUENCE_CODE = "sale.order",
    } = process.env;

    if (!ODOO_URL || !ODOO_DB || !ODOO_LOGIN || !ODOO_API_KEY) {
      return res.status(500).json({ error: "Faltan variables de entorno de Odoo." });
    }

    // --- 1) Autenticación (API Key como 'password') ---
    const authResp = await fetch(`${ODOO_URL}/web/session/authenticate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        params: { db: ODOO_DB, login: ODOO_LOGIN, password: ODOO_API_KEY },
      }),
    });

    const authJson = await authResp.json();
    if (!authJson?.result) {
      return res.status(401).json({ error: "No se pudo autenticar en Odoo." });
    }

    // Tomar cookie de sesión para siguientes llamadas RPC
    const setCookie = authResp.headers.get("set-cookie") || "";
    const cookieHeader = setCookie
      .split(",")
      .map((s) => s.split(";")[0])
      .filter(Boolean)
      .join("; ");

    // Helper para llamar RPC call_kw
    const rpc = async (payload) => {
      const resp = await fetch(`${ODOO_URL}/web/dataset/call_kw`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookieHeader,
        },
        body: JSON.stringify({ jsonrpc: "2.0", method: "call", params: payload }),
      });
      return resp.json();
    };

    // --- 2) Intento principal: ir.sequence.next_by_code ---
    const seqJson = await rpc({
      model: "ir.sequence",
      method: "next_by_code",
      args: [ODOO_SEQUENCE_CODE],
      kwargs: {},
    });

    let folio = seqJson?.result || null;

    // --- 3) Fallback: leer la última sale.order y calcular +1 (ej. S03519 → S03520) ---
    if (!folio) {
      const lastJson = await rpc({
        model: "sale.order",
        method: "search_read",
        args: [
          [["name", "!=", false]],
          ["name"],
          0,
          1,
          "id desc",
        ],
        kwargs: {},
      });

      const lastName = lastJson?.result?.[0]?.name || null;

      if (lastName && /^S0*\d+$/i.test(lastName)) {
        // Extrae número y suma 1, preservando longitud de dígitos
        const numPart = lastName.replace(/[^0-9]/g, "");
        const nextNum = String(parseInt(numPart, 10) + 1).padStart(numPart.length, "0");
        // Conserva prefijo 'S'
        folio = `S${nextNum}`;
      } else {
        return res.status(500).json({
          error: "No se pudo obtener el folio desde Odoo (ni calcular fallback).",
        });
      }
    }

    return res.status(200).json({ folio });
  } catch (err) {
    return res.status(500).json({ error: String(err?.message || err) });
  }
}

