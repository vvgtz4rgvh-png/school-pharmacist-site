/* ==========================================================================
   csv.js
   記録一覧を CSV としてダウンロードする共通処理。
   Excel での文字化けを避けるため BOM を付与しています。
   ========================================================================== */

function exportRecordsToCSV(filename, columns, records) {
  const header = columns.map((c) => c.label).join(",");
  const rows = records.map((r) =>
    columns
      .map((c) => {
        const v = r[c.key] ?? "";
        const s = String(v).replace(/"/g, '""');
        return /[",\n]/.test(s) ? `"${s}"` : s;
      })
      .join(",")
  );
  const csv = [header, ...rows].join("\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
