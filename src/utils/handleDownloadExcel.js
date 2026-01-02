/**
 * Export array of objects as CSV and trigger download in browser.
 * - `options.headers` (Array) can specify column order/keys.
 */
export function handleDownloadCSV(data = [], filename = "export.csv", options = {}) {
	if (!Array.isArray(data) || data.length === 0) {
		console.warn("handleDownloadCSV: no data to export");
		return;
	}

	const headers =
		Array.isArray(options.headers) && options.headers.length > 0
			? options.headers
			: Object.keys(data[0]);

	const rows = [headers.join(",")];

	for (const row of data) {
		const values = headers.map((h) => {
			let v = row[h];
			if (v === null || v === undefined) v = "";
			// Escape double quotes and wrap value in quotes
			return `"${String(v).replace(/"/g, '""')}"`;
		});
		rows.push(values.join(","));
	}

	const csvString = rows.join("\r\n");
	const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });

	const downloadName =
		filename && String(filename).length > 0
			? String(filename).endsWith(".csv")
				? String(filename)
				: `${String(filename)}.csv`
			: "export.csv";

	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = downloadName;
	document.body.appendChild(a);
	a.click();
	a.remove();
	URL.revokeObjectURL(url);
}

export default handleDownloadCSV;
