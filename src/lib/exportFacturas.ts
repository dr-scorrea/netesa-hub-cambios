import * as XLSX from "xlsx";
import type { Factura } from "@/data/finanzas";

const fmt = (n: number) => Math.round(n * 100) / 100;

/**
 * Generates a contable XLSX with the strict format required by the external
 * accounting software: dates as real Date cells, amounts as numerics.
 */
export function exportFacturasToExcel(facturas: Factura[], filename?: string) {
  const rows = facturas.map((f, idx) => ({
    "N°": idx + 1,
    "Código": f.id,
    "Fecha emisión": f.fechaEmision ? new Date(f.fechaEmision) : "",
    "RUC proveedor": f.ruc,
    "Razón social": f.proveedor,
    "Tipo doc.": f.numDocumento.startsWith("B") ? "Boleta" : "Factura",
    "N° documento": f.numDocumento,
    "Moneda": f.moneda,
    "Subtotal": fmt(f.subtotal),
    "IGV (18%)": fmt(f.igv),
    "Total": fmt(f.total),
    "Categoría": f.categoria,
    "Estado": f.estado,
    "Procesado IA": f.leidoPorIA ? "Sí" : "No",
  }));

  const ws = XLSX.utils.json_to_sheet(rows, { cellDates: true });

  // Column widths
  ws["!cols"] = [
    { wch: 5 },
    { wch: 14 },
    { wch: 13 },
    { wch: 13 },
    { wch: 32 },
    { wch: 10 },
    { wch: 16 },
    { wch: 8 },
    { wch: 12 },
    { wch: 12 },
    { wch: 12 },
    { wch: 22 },
    { wch: 16 },
    { wch: 12 },
  ];

  // Apply numeric/date formats
  const range = XLSX.utils.decode_range(ws["!ref"]!);
  for (let R = 1; R <= range.e.r; ++R) {
    // Date column = C (index 2)
    const dateCell = ws[XLSX.utils.encode_cell({ r: R, c: 2 })];
    if (dateCell && dateCell.v instanceof Date) {
      dateCell.t = "d";
      dateCell.z = "dd/mm/yyyy";
    }
    // Subtotal/IGV/Total = I, J, K (8, 9, 10)
    for (const c of [8, 9, 10]) {
      const cell = ws[XLSX.utils.encode_cell({ r: R, c })];
      if (cell) {
        cell.t = "n";
        cell.z = "#,##0.00";
      }
    }
  }

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Facturas");

  // Totals sheet
  const totalPEN = facturas
    .filter((f) => f.moneda === "PEN" && (f.estado === "aprobada" || f.estado === "pagada"))
    .reduce((s, f) => s + f.total, 0);
  const totalUSD = facturas
    .filter((f) => f.moneda === "USD" && (f.estado === "aprobada" || f.estado === "pagada"))
    .reduce((s, f) => s + f.total, 0);

  const summary = [
    { Indicador: "Total facturas", Valor: facturas.length },
    { Indicador: "Aprobadas o pagadas — PEN", Valor: fmt(totalPEN) },
    { Indicador: "Aprobadas o pagadas — USD", Valor: fmt(totalUSD) },
    { Indicador: "Generado", Valor: new Date() },
  ];
  const ws2 = XLSX.utils.json_to_sheet(summary, { cellDates: true });
  ws2["!cols"] = [{ wch: 32 }, { wch: 18 }];
  XLSX.utils.book_append_sheet(wb, ws2, "Resumen");

  const name = filename ?? `reporte-contable-netesa-${new Date().toISOString().slice(0, 10)}.xlsx`;
  XLSX.writeFile(wb, name);
}
