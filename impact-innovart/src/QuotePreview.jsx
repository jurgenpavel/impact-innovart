import React, { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import LogoInnovart from "./Assets/Logoinnovartmd.jpg";

const fmt = (n, d = 2) =>
  Number(n || 0).toLocaleString(undefined, {
    maximumFractionDigits: d,
    minimumFractionDigits: d,
  });
const money = (n) => `$ ${fmt(n, 2)} MXN`;

export default function QuotePreview() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const data = state || {};
  const {
    cliente = "",
    fecha = "",
    vendedor = "",
    producto = "",
    descripcion = "",
    cantidad = 1,
    subtotalMXN = 0,      // Total sin IVA (con utilidad)
    totalMXNConIVA = 0,   // Total con IVA
    ivaPercent = 16,
  } = data;

  const unitarioSinIVA = useMemo(
    () => (cantidad ? subtotalMXN / Number(cantidad) : 0),
    [subtotalMXN, cantidad]
  );
  const ivaMonto = useMemo(
    () => subtotalMXN * (Number(ivaPercent) / 100),
    [subtotalMXN, ivaPercent]
  );

  const imprimirPDF = () => window.print();

  return (
    <div className="w-full min-h-screen bg-white text-neutral-900">
      <div className="max-w-4xl mx-auto p-6 print:p-8">
        {/* Encabezado */}
        <div className="flex items-center justify-between mb-6">
          <img src={LogoInnovart} alt="Innovart.MD" className="h-10 w-auto print:h-12" />
        </div>

        <h1 className="text-center font-semibold tracking-wide mb-6">COTIZACIÓN</h1>

        {/* Datos del cliente */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 text-sm">
          <Field label="Cliente" value={cliente} />
          <Field label="Fecha de cotización" value={fecha} />
          <Field label="Vendedor" value={vendedor} />
        </div>

        {/* Tabla */}
        <table className="w-full text-sm border-collapse mb-6">
          <thead>
            <tr className="bg-neutral-100">
              <Th>Descripción</Th>
              <Th className="text-right">Cantidad</Th>
              <Th className="text-right">Precio unitario</Th>
              <Th className="text-right">Impuestos</Th>
              <Th className="text-right">Importe</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>
                <div className="font-medium">{producto}</div>
                <div className="text-neutral-500">{descripcion}</div>
              </Td>
              <Td className="text-right">{fmt(cantidad, 2)}</Td>
              <Td className="text-right">{money(unitarioSinIVA)}</Td>
              <Td className="text-right">IVA ({fmt(ivaPercent, 0)}%)</Td>
              <Td className="text-right">{money(subtotalMXN)}</Td>
            </tr>
          </tbody>
        </table>

        {/* Totales */}
        <div className="max-w-md ml-auto text-sm">
          <Row label="Importe sin impuestos" value={money(subtotalMXN)} />
          <Row label={`IVA ${fmt(ivaPercent, 0)}%`} value={money(ivaMonto)} />
          <Row label="Total" value={money(totalMXNConIVA)} bold big />
        </div>

        {/* Leyendas */}
        <ul className="mt-8 text-xs text-neutral-600 space-y-1">
          <li>* COTIZACIÓN INCLUYE MANO DE OBRA Y MATERIAL</li>
          <li>* COTIZACIÓN EN PESOS MXN</li>
          <li>* COTIZACIÓN SUJETA A CAMBIOS</li>
        </ul>

        {/* Botones (ocultos al imprimir) */}
        <div className="mt-8 flex gap-3 print:hidden">
          <button onClick={() => navigate(-1)} className="px-4 py-2 rounded-lg border">
            Volver a editar
          </button>
          <button onClick={imprimirPDF} className="px-4 py-2 rounded-lg bg-black text-white">
            Exportar PDF
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value }) {
  return (
    <div>
      <div className="font-semibold">{label}:</div>
      <div>{value || "—"}</div>
    </div>
  );
}
function Th({ children, className = "" }) {
  return <th className={`p-2 border border-neutral-200 ${className}`}>{children}</th>;
}
function Td({ children, className = "" }) {
  return <td className={`p-2 border border-neutral-200 ${className}`}>{children}</td>;
}
function Row({ label, value, bold, big }) {
  return (
    <div className={`flex items-center justify-between ${bold ? "font-semibold" : ""} ${big ? "text-base" : ""}`}>
      <div>{label}</div>
      <div>{value}</div>
    </div>
  );
}
