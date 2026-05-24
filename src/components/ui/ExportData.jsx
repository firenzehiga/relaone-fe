import React from "react";
import * as XLSX from "xlsx";
import { FileText } from "lucide-react";

export function ExportData({
	data = [],
	filename = "export-data",
	columns = [],
	buttonText = "Export XLSX",
	className = "",
	disabled = false,
	variant = "primary",
}) {
	const getButtonClass = () => {
		const baseClass =
			"flex items-center px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
		switch (variant) {
			case "success":
				return `${baseClass} bg-emerald-600 text-white hover:bg-emerald-700`;
			case "secondary":
				return `${baseClass} bg-gray-600 text-white hover:bg-gray-700`;
			default:
				return `${baseClass} bg-emerald-600 text-white hover:bg-emerald-700`;
		}
	};

	const getValueByKey = (obj, key) => {
		if (!key) return "";
		// support nested keys like 'user.nama'
		return (
			key
				.split(".")
				.reduce((o, k) => (o && o[k] !== undefined ? o[k] : ""), obj) || ""
		);
	};

	const exportToXLSX = () => {
		try {
			if (!data || data.length === 0) {
				// nothing to export
				return;
			}

			const cols =
				columns && columns.length > 0
					? columns
					: Object.keys(data[0]).map((k) => ({ key: k, header: k }));

			const headers = cols.map((c) =>
				typeof c === "string" ? c : c.header || c.key,
			);
			const rows = data.map((row) => {
				const output = {};
				cols.forEach((c, idx) => {
					const key = typeof c === "string" ? c : c.key;
					const formatter = typeof c === "object" ? c.formatter : null;
					const raw = formatter ? formatter(row) : getValueByKey(row, key);
					output[headers[idx]] = raw;
				});
				return output;
			});

			const worksheet = XLSX.utils.json_to_sheet(rows);
			const workbook = XLSX.utils.book_new();
			XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
			XLSX.writeFile(
				workbook,
				`${filename}-${new Date().toISOString().split("T")[0]}.xlsx`,
			);
		} catch (error) {
			console.error("Error exporting XLSX:", error);
			// swallow or optionally show a toast
		}
	};

	return (
		<button
			type="button"
			onClick={exportToXLSX}
			disabled={disabled || !data || data.length === 0}
			className={`${getButtonClass()} ${className}`}>
			<FileText className="w-4 h-4 mr-2" />
			{buttonText}
		</button>
	);
}

export default ExportData;
