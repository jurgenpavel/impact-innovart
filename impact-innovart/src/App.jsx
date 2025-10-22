import React, { useMemo, useState } from "react";
import LogoImpact from "./Assets/Logoimpact.jpg";

/**
 * Impact by Innovart.MD — Cotizador Web (Preview)
 * PREVIEW interactiva para validar flujo y cálculos.
 * - TailwindCSS para estilos.
 * - Datos de tablas integrados como constantes.
 */

// --- Catálogos ---
const MATERIALES = [
  "LAMINA","PLACA","PTR","IPR","IPS","CANAL U","ÁNGULO","SOLERA","REDONDO","CUADRADO",
];

const COMPOSICIONES = [
  { key: "ACC", label: "ACC (Acero al Carbón)" },
  { key: "ALUMINIO", label: "ALUMINIO" },
  { key: "INOX", label: "INOX (Acero Inoxidable)" },
  { key: "COBRE", label: "COBRE" },
  { key: "NIQUEL", label: "NIQUEL" },
  { key: "LATON", label: "LATON" },
  { key: "BRONCE", label: "BRONCE" },
];

// Densidades kg/m3
const DENSIDADES = {
  ACC: 8050, ALUMINIO: 2957, INOX: 8050, COBRE: 8960, NIQUEL: 8940, LATON: 8730, BRONCE: 8900,
};

// Tabla de espesores + $/mm por material
const ESPESORES = [
  { cal: '1 1/8"', in: 1.12, mm: 28.45, acc: 0.5, inox: 0, aluminio: 0, cobre: 0, niquel: 0, laton: 0, bronce: 0 },
  { cal: '1"', in: 1.0, mm: 25.40, acc: 0.5, inox: 0, aluminio: 0, cobre: 0, niquel: 0, laton: 0, bronce: 0 },
  { cal: '7/8"', in: 0.874, mm: 22.20, acc: 0.35, inox: 0, aluminio: 0, cobre: 0, niquel: 0, laton: 0, bronce: 0 },
  { cal: '3/4"', in: 0.75, mm: 19.05, acc: 0.35, inox: 0, aluminio: 0, cobre: 0, niquel: 0, laton: 0, bronce: 0 },
  { cal: '5/8"', in: 0.625, mm: 15.88, acc: 0.15, inox: 0, aluminio: 0, cobre: 0, niquel: 0, laton: 0, bronce: 0 },
  { cal: '1/2"', in: 0.5, mm: 12.70, acc: 0.07, inox: 0.105, aluminio: 0, cobre: 0, niquel: 0, laton: 0, bronce: 0 },
  { cal: '7/16"', in: 0.4375, mm: 11.11, acc: 0.07, inox: 0.105, aluminio: 0, cobre: 0, niquel: 0, laton: 0, bronce: 0 },
  { cal: '3/8"', in: 0.375, mm: 9.53, acc: 0.07, inox: 0.105, aluminio: 0, cobre: 0, niquel: 0, laton: 0, bronce: 0 },
  { cal: '5/16"', in: 0.3125, mm: 7.94, acc: 0.07, inox: 0.105, aluminio: 0, cobre: 0, niquel: 0, laton: 0, bronce: 0 },
  { cal: '1/4"', in: 0.25, mm: 6.35, acc: 0.05, inox: 0.075, aluminio: 0, cobre: 0, niquel: 0, laton: 0, bronce: 0 },
  { cal: '3', in: 0.2391, mm: 6.07, acc: 0.05, inox: 0.075, aluminio: 0, cobre: 0, niquel: 0, laton: 0, bronce: 0 },
  { cal: '4', in: 0.2242, mm: 5.69, acc: 0.05, inox: 0.075, aluminio: 0, cobre: 0, niquel: 0, laton: 0, bronce: 0 },
  { cal: '5', in: 0.2092, mm: 5.31, acc: 0.05, inox: 0.075, aluminio: 0, cobre: 0, niquel: 0, laton: 0, bronce: 0 },
  { cal: '6', in: 0.1943, mm: 4.94, acc: 0.05, inox: 0.075, aluminio: 0, cobre: 0, niquel: 0, laton: 0, bronce: 0 },
  { cal: '3/16"', in: 0.1875, mm: 4.76, acc: 0.05, inox: 0.075, aluminio: 0.115, cobre: 0, niquel: 0, laton: 0, bronce: 0 },
  { cal: '7', in: 0.1793, mm: 4.55, acc: 0.05, inox: 0.075, aluminio: 0.115, cobre: 0, niquel: 0, laton: 0, bronce: 0 },
  { cal: '8', in: 0.1644, mm: 4.18, acc: 0.05, inox: 0.075, aluminio: 0.115, cobre: 0, niquel: 0, laton: 0, bronce: 0 },
  { cal: '9', in: 0.1495, mm: 3.80, acc: 0.05, inox: 0.075, aluminio: 0.115, cobre: 0, niquel: 0, laton: 0, bronce: 0 },
  { cal: '10', in: 0.1345, mm: 3.42, acc: 0.04, inox: 0.06, aluminio: 0.092, cobre: 0.24, niquel: 0.24, laton: 0.24, bronce: 0.24 },
  { cal: '1/8"', in: 0.125, mm: 3.18, acc: 0.04, inox: 0.06, aluminio: 0.092, cobre: 0.24, niquel: 0.24, laton: 0.24, bronce: 0.24 },
  { cal: '11', in: 0.1196, mm: 3.04, acc: 0.04, inox: 0.06, aluminio: 0.092, cobre: 0.24, niquel: 0.24, laton: 0.24, bronce: 0.24 },
  { cal: '12', in: 0.1046, mm: 2.66, acc: 0.04, inox: 0.06, aluminio: 0.092, cobre: 0.24, niquel: 0.24, laton: 0.24, bronce: 0.24 },
  { cal: '13', in: 0.0897, mm: 2.28, acc: 0.04, inox: 0.06, aluminio: 0.092, cobre: 0.24, niquel: 0.24, laton: 0.24, bronce: 0.24 },
  { cal: '14', in: 0.0747, mm: 1.90, acc: 0.03, inox: 0.045, aluminio: 0.069, cobre: 0.18, niquel: 0.18, laton: 0.18, bronce: 0.18 },
  { cal: '15', in: 0.0673, mm: 1.71, acc: 0.03, inox: 0.045, aluminio: 0.069, cobre: 0.18, niquel: 0.18, laton: 0.18, bronce: 0.18 },
  { cal: '1/16"', in: 0.0625, mm: 1.59, acc: 0.03, inox: 0.045, aluminio: 0.069, cobre: 0.18, niquel: 0.18, laton: 0.18, bronce: 0.18 },
  { cal: '16', in: 0.0598, mm: 1.52, acc: 0.03, inox: 0.045, aluminio: 0.069, cobre: 0.18, niquel: 0.18, laton: 0.18, bronce: 0.18 },
  { cal: '17', in: 0.0538, mm: 1.37, acc: 0.03, inox: 0.045, aluminio: 0.069, cobre: 0.18, niquel: 0.18, laton: 0.18, bronce: 0.18 },
  { cal: '18', in: 0.0478, mm: 1.21, acc: 0.03, inox: 0.045, aluminio: 0.069, cobre: 0.18, niquel: 0.18, laton: 0.18, bronce: 0.18 },
  { cal: '19', in: 0.0418, mm: 1.06, acc: 0.03, inox: 0.045, aluminio: 0.069, cobre: 0.18, niquel: 0.18, laton: 0.18, bronce: 0.18 },
  { cal: '20', in: 0.0359, mm: 0.91, acc: 0.03, inox: 0.045, aluminio: 0.069, cobre: 0.18, niquel: 0.18, laton: 0.18, bronce: 0.18 },
  { cal: '22', in: 0.03, mm: 0.76, acc: 0.03, inox: 0.045, aluminio: 0.069, cobre: 0.18, niquel: 0.18, laton: 0.18, bronce: 0.18 },
  { cal: '24', in: 0.024, mm: 0.61, acc: 0.03, inox: 0.045, aluminio: 0.069, cobre: 0.18, niquel: 0.18, laton: 0.18, bronce: 0.18 },
];

// Costo por doblez por espesor (mm)
const COSTO_DOBLEZ_POR_MM = new Map([
  [28.45, 100], [25.40, 100], [22.20, 100], [19.05, 100],
  [15.88, 40], [12.70, 40], [11.11, 40], [9.53, 35], [7.94, 35],
  [6.35, 25], [6.07, 25], [5.69, 25], [5.31, 25], [4.94, 25], [4.76, 25],
  [4.55, 25], [4.18, 25], [3.80, 25], [3.42, 20], [3.18, 20], [3.04, 20],
  [2.66, 20], [2.28, 20], [1.90, 20], [1.71, 20], [1.59, 15], [1.52, 15],
  [1.37, 15], [1.21, 15], [1.06, 15], [0.91, 15], [0.76, 15], [0.61, 15],
]);

// $/mm de soldadura por material
const SOLDADURA_POR_MM = { ACC: 0.98, INOX: 2.76, ALUMINIO: 3.54 };

// Tarifas por tiempo (MXN/s)
const TARIFA_TIEMPO = { corte: 0.21, doblez: 0.08, maquinado: 0.24, soldadura: 0.07 };

const fmt = (n, d = 2) => {
  if (Number.isNaN(n) || n === null || n === undefined) return "";
  return Number(n).toLocaleString(undefined, { maximumFractionDigits: d, minimumFractionDigits: d });
};
const money = (n) => `$ ${fmt(n, 2)} MXN`;

const getEspesorRow = (mm) => ESPESORES.find((r) => r.mm === mm);
const costoPorMmFrom = (row, comp) => {
  if (!row) return 0;
  switch (comp) {
    case "ACC": return row.acc;
    case "INOX": return row.inox;
    case "ALUMINIO": return row.aluminio;
    case "COBRE": return row.cobre;
    case "NIQUEL": return row.niquel;
    case "LATON": return row.laton;
    case "BRONCE": return row.bronce;
    default: return 0;
  }
};

export default function App() {
  // Información del cliente
  const [cliente, setCliente] = useState("");
  const [fecha, setFecha] = useState("");
  const [vendedor, setVendedor] = useState(""); // ← nuevo

  // Cost Breakdown
  const [producto, setProducto] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [grado, setGrado] = useState("");
  const [cantidad, setCantidad] = useState(1);

  // Materiales
  const [material, setMaterial] = useState("");
  const [composicion, setComposicion] = useState("");
  const [espesorMm, setEspesorMm] = useState(null);
  const [costoKg, setCostoKg] = useState(0);
  const [largoMm, setLargoMm] = useState(0);
  const [anchoMm, setAnchoMm] = useState(0);

  // Operaciones
  const [perimetroCorte, setPerimetroCorte] = useState(0);
  const [tiempoCorte, setTiempoCorte] = useState(0);
  const [cantDoblez, setCantDoblez] = useState(0);
  const [tiempoDoblez, setTiempoDoblez] = useState(0);
  const [tiempoMaquinado, setTiempoMaquinado] = useState(0);
  const [perimetroSoldadura, setPerimetroSoldadura] = useState(0);
  const [tiempoSoldadura, setTiempoSoldadura] = useState(0);
  const [costoPintura, setCostoPintura] = useState(0);
  const [costoEmpaque, setCostoEmpaque] = useState(0);

  // Parámetros globales
  const [utilidad, setUtilidad] = useState(0.25);
  const [tipoCambio, setTipoCambio] = useState(18.88);

  const espRow = useMemo(() => getEspesorRow(Number(espesorMm)), [espesorMm]);
  const densidad = useMemo(() => (composicion ? DENSIDADES[composicion] : 0), [composicion]);

  // Volumen (mm^3)
  const volumenBruto = useMemo(
    () => (Number(espesorMm) * Number(largoMm) * Number(anchoMm)) || 0,
    [espesorMm, largoMm, anchoMm]
  );

  // Peso sin scrap (kg)
  const pesoBrutoSinScrap = useMemo(() => {
    if (!densidad) return 0;
    return (Number(espesorMm) / 1000) * densidad * (Number(largoMm) / 1000) * (Number(anchoMm) / 1000);
  }, [densidad, espesorMm, largoMm, anchoMm]);

  // LARGO+SCRAP y ANCHO+SCRAP (m)
  const largoMasScrap = useMemo(() => ((Number(espesorMm) / 1000) * 2) + (Number(largoMm) / 1000), [espesorMm, largoMm]);
  const anchoMasScrap = useMemo(() => ((Number(espesorMm) / 1000) * 2) + (Number(anchoMm) / 1000), [espesorMm, anchoMm]);

  // Peso con scrap (kg)
  const pesoBruto = useMemo(() => {
    if (!densidad) return 0;
    return (Number(espesorMm) / 1000) * densidad * largoMasScrap * anchoMasScrap;
  }, [densidad, espesorMm, largoMasScrap, anchoMasScrap]);

  // Materia prima
  const costoBrutoMP = useMemo(() => pesoBruto * Number(costoKg), [pesoBruto, costoKg]);
  const costoNetoMP = useMemo(() => costoBrutoMP * 1.16, [costoBrutoMP]);

  // Operaciones
  const costoMmPorComp = useMemo(() => costoPorMmFrom(espRow, composicion), [espRow, composicion]);
  const precioCorte = useMemo(
    () => (Number(perimetroCorte) * Number(costoMmPorComp)) + (Number(tiempoCorte) * TARIFA_TIEMPO.corte),
    [perimetroCorte, costoMmPorComp, tiempoCorte]
  );
  const precioPorDoblez = useMemo(() => COSTO_DOBLEZ_POR_MM.get(Number(espesorMm)) || 0, [espesorMm]);
  const precioDoblez = useMemo(
    () => (Number(cantDoblez) * precioPorDoblez) + (Number(tiempoDoblez) * TARIFA_TIEMPO.doblez),
    [cantDoblez, precioPorDoblez, tiempoDoblez]
  );
  const precioMaquinado = useMemo(() => Number(tiempoMaquinado) * TARIFA_TIEMPO.maquinado, [tiempoMaquinado]);

  const soldaduraMm = useMemo(() => {
    if (composicion === "ACC") return SOLDADURA_POR_MM.ACC;
    if (composicion === "INOX") return SOLDADURA_POR_MM.INOX;
    if (composicion === "ALUMINIO") return SOLDADURA_POR_MM.ALUMINIO;
    return 0;
  }, [composicion]);

  const precioSoldadura = useMemo(
    () => (Number(perimetroSoldadura) * soldaduraMm) + (Number(tiempoSoldadura) * TARIFA_TIEMPO.soldadura),
    [perimetroSoldadura, soldaduraMm, tiempoSoldadura]
  );

  const manoDeObra = useMemo(
    () => precioCorte + precioDoblez + precioMaquinado + precioSoldadura + Number(costoPintura) + Number(costoEmpaque),
    [precioCorte, precioDoblez, precioMaquinado, precioSoldadura, costoPintura, costoEmpaque]
  );

  const costoMateriaPrima = costoNetoMP;
  const subtotal = useMemo(() => costoMateriaPrima + manoDeObra, [costoMateriaPrima, manoDeObra]);
  const totalMXN = useMemo(() => subtotal * (1 + Number(utilidad || 0)), [subtotal, utilidad]);
  const totalMXNConIVA = useMemo(() => totalMXN * 1.16, [totalMXN]);
  const totalUSDConIVA = useMemo(() => (tipoCambio ? totalMXNConIVA / Number(tipoCambio) : 0), [totalMXNConIVA, tipoCambio]);

  const opcionesEspesor = useMemo(() => ESPESORES.map((r) => r.mm), []);

  return (
    <div className="w-full min-h-screen bg-white text-neutral-900">
      <div className="max-w-6xl mx-auto p-4 md:p-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-4">
          <img
            src={LogoImpact}
            alt="Innovart.MD"
            className="h-12 md:h-16 w-auto select-none"
          />
        </div>

        {/* INFORMACIÓN DEL CLIENTE */}
        <section className="rounded-2xl border p-4 md:p-6 shadow-sm mb-6">
          <h2 className="font-extrabold text-xl mb-4">INFORMACIÓN DEL CLIENTE</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <TextField label="Nombre de cliente" value={cliente} onChange={setCliente} />
            <TextField label="Fecha" value={fecha} onChange={setFecha} />
            <TextField label="Vendedor" value={vendedor} onChange={setVendedor} />
          </div>
        </section>

        {/* COST BREAKDOWN */}
        <section className="rounded-2xl border p-4 md:p-6 shadow-sm mb-6">
          <h2 className="font-extrabold text-xl mb-4">COST BREAKDOWN</h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <TextField className="md:col-span-2" label="Producto" placeholder="Nombre" value={producto} onChange={setProducto} />
            <TextField className="md:col-span-2" label="Descripción" placeholder="Descripción Técnica" value={descripcion} onChange={setDescripcion} />
            <TextField label="Grado" placeholder="304, 430, A36…" value={grado} onChange={setGrado} />
            <NumberField label="Cantidad" value={cantidad} onChange={setCantidad} min={1} />

            <SelectField label="Material" value={material} onChange={setMaterial} options={MATERIALES} placeholder="Selecciona material…" />
            <SelectField label="Composición" value={composicion} onChange={setComposicion} options={COMPOSICIONES.map(c=>({value:c.key,label:c.label}))} placeholder="Selecciona composición…" />
            <SelectField label="Espesor (mm)" value={espesorMm ?? ""} onChange={(v)=>setEspesorMm(Number(v))} options={opcionesEspesor.map(v=>({value:v,label:v}))} placeholder="Selecciona espesor…" />

            <NumberField label="Costo por Kg (MXN)" value={costoKg} onChange={setCostoKg} />
            <NumberField label="Largo (mm)" value={largoMm} onChange={setLargoMm} />
            <NumberField label="Ancho (mm)" value={anchoMm} onChange={setAnchoMm} />
          </div>

          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <Info label="Densidad (kg/m³)" value={fmt(densidad,0)} />
            <Info label="Volumen bruto (mm³)" value={fmt(volumenBruto,0)} />
            <Info label="Peso bruto sin scrap (kg)" value={fmt(pesoBrutoSinScrap,3)} />
            <Info label="Largo + Scrap (m)" value={fmt(largoMasScrap,3)} />
            <Info label="Ancho + Scrap (m)" value={fmt(anchoMasScrap,3)} />
            <Info label="Peso bruto (kg)" value={fmt(pesoBruto,3)} />
            <Info label="Costo bruto MP" value={money(costoBrutoMP)} />
            <Info label="Costo neto MP (c/ IVA)" value={money(costoNetoMP)} />
          </div>
        </section>

        {/* OPERACIONES */}
        <section className="rounded-2xl border p-4 md:p-6 shadow-sm mb-6">
          <h2 className="font-extrabold text-xl mb-4">OPERACIONES</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <NumberField label="Perímetro corte (mm)" value={perimetroCorte} onChange={setPerimetroCorte} />
            <NumberField label="Tiempo corte (s)" value={tiempoCorte} onChange={setTiempoCorte} />
            <NumberField label="Cantidad doblez" value={cantDoblez} onChange={setCantDoblez} />
            <NumberField label="Tiempo doblez (s)" value={tiempoDoblez} onChange={setTiempoDoblez} />
            <NumberField label="Tiempo maquinado (s)" value={tiempoMaquinado} onChange={setTiempoMaquinado} />
            <NumberField label="Perímetro soldadura (mm)" value={perimetroSoldadura} onChange={setPerimetroSoldadura} />
            <NumberField label="Tiempo soldadura (s)" value={tiempoSoldadura} onChange={setTiempoSoldadura} />
            <NumberField label="Costo pintura (MXN)" value={costoPintura} onChange={setCostoPintura} />
            <NumberField label="Costo empaque (MXN)" value={costoEmpaque} onChange={setCostoEmpaque} />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mt-6">
            <Info label="Tarifa tiempo corte (MXN/s)" value={fmt(TARIFA_TIEMPO.corte,2)} />
            <Info label="Tarifa tiempo doblez (MXN/s)" value={fmt(TARIFA_TIEMPO.doblez,2)} />
            <Info label="Tarifa tiempo maqu. (MXN/s)" value={fmt(TARIFA_TIEMPO.maquinado,2)} />
            <Info label="Tarifa tiempo sold. (MXN/s)" value={fmt(TARIFA_TIEMPO.soldadura,2)} />
            <Info label="$ /mm material (espesor×comp)" value={fmt(costoMmPorComp,3)} />
            <Info label="$ /doblez (por espesor)" value={fmt(precioPorDoblez,2)} />
            <Info label="$ /mm soldadura (según comp)" value={fmt(soldaduraMm,2)} />
          </div>
        </section>

        {/* RESULTADOS */}
        <section className="rounded-2xl border p-4 md:p-6 shadow-sm">
          <h2 className="font-extrabold text-xl mb-4">RESULTADOS</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <NumberField label="Utilidad (ej. 0.25 = 25%)" value={utilidad} onChange={setUtilidad} step={0.01} />
            <NumberField label="Valor del dólar (MXN)" value={tipoCambio} onChange={setTipoCambio} step={0.01} />
            <div className="hidden md:block" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card title="Materia Prima">
              <Line label="$ Costo bruto" value={money(costoBrutoMP)} />
              <Line label="$ Costo neto (c/ IVA)" value={money(costoNetoMP)} />
            </Card>
            <Card title="Mano de Obra (detalle)">
              <Line label="$ Corte" value={money(precioCorte)} />
              <Line label="$ Doblez" value={money(precioDoblez)} />
              <Line label="$ Maquinado" value={money(precioMaquinado)} />
              <Line label="$ Soldadura" value={money(precioSoldadura)} />
              <Line label="$ Pintura" value={money(Number(costoPintura))} />
              <Line label="$ Empaque" value={money(Number(costoEmpaque))} />
              <div className="mt-2 border-t pt-2">
                <Line label="Mano de Obra Total" value={money(manoDeObra)} bold />
              </div>
            </Card>
            <Card title="Totales">
              <Line label="Subtotal" value={money(subtotal)} />
              <Line label="Total MXN" value={money(totalMXN)} />
              <Line label="Total MXN + IVA" value={money(totalMXNConIVA)} />
              <Line label="Total USD + IVA" value={`$ ${fmt(totalUSDConIVA,2)} USD`} />
            </Card>
          </div>
        </section>

        <div className="text-xs text-neutral-500 mt-6">Preview de cálculos — Innovart.MD</div>
      </div>
    </div>
  );
}

// UI helpers
function NumberField({ label, value, onChange, step = 1, min }) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <input
        type="number"
        className="mt-1 w-full rounded-xl border px-3 py-2"
        value={value}
        step={step}
        min={min}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}

function TextField({ label, value, onChange, placeholder = "", className = "" }) {
  return (
    <div className={className}>
      <label className="text-sm font-medium">{label}</label>
      <input
        className="mt-1 w-full rounded-xl border px-3 py-2"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function SelectField({ label, value, onChange, options, placeholder }) {
  const opts = options.map((o) => (typeof o === "string" ? { value: o, label: o } : o));
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <select
        className="mt-1 w-full rounded-xl border px-3 py-2"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">{placeholder || "Selecciona..."}</option>
        {opts.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="rounded-xl border px-3 py-2 bg-neutral-50">
      <div className="text-[11px] uppercase tracking-wide text-neutral-500">{label}</div>
      <div className="font-semibold">{value}</div>
    </div>
  );
}

function Card({ title, children }) {
  return (
    <div className="rounded-2xl border p-4 shadow-sm">
      <div className="font-semibold mb-3">{title}</div>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function Line({ label, value, bold }) {
  return (
    <div className={`flex items-center justify-between ${bold ? "font-semibold" : ""}`}>
      <div className="text-sm text-neutral-700">{label}</div>
      <div className="tabular-nums">{value}</div>
    </div>
  );
}
