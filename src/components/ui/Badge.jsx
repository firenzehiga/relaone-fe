import { cn } from "@/utils";

/**
 * Komponen Badge untuk menampilkan label atau status dengan berbagai variant warna
 * Berguna untuk menampilkan tag, status, kategori, atau informasi singkat lainnya
 *
 * @param {Object} props - Props untuk Badge component
 * @param {React.ReactNode} props.children - Konten yang ditampilkan di dalam badge
 * @param {string} [props.variant="default"] - Variant warna badge (default, primary, success, warning, danger, secondary, outline)
 * @param {string} [props.size="sm"] - Ukuran badge (sm, md, lg)
 * @param {string} [props.className] - Class CSS tambahan untuk styling kustom
 * @param {...any} props - Props tambahan yang akan di-forward ke element span
 * @returns {JSX.Element} Badge component dengan styling sesuai variant dan size
 */
export default function Badge({
	children,
	variant = "default",
	size = "sm",
	className,
	color, // optional hex color, e.g. "#10B981"
	...props
}) {
	const variants = {
		default: "bg-gray-100 text-gray-800 border border-gray-200",
		primary: "bg-blue-100 text-blue-800 border border-blue-200",
		info: "bg-teal-100 text-teal-800 border border-teal-200",
		success: "bg-green-100 text-green-800 border border-green-200",
		warning: "bg-yellow-100 text-yellow-800 border border-yellow-200",
		orange: "bg-orange-100 text-orange-800 border border-orange-200",
		danger: "bg-red-100 text-red-800 border border-red-200",
		secondary: "bg-purple-100 text-purple-800 border border-purple-200",
		outline: "border border-gray-300 text-gray-700 bg-white",
	};

	const sizes = {
		sm: "px-2 py-1 text-xs",
		md: "px-3 py-1 text-sm",
		lg: "px-4 py-2 text-base",
	};

	// If a hex color is provided, use inline styles derived from it so
	// badge can reflect arbitrary category colors (hex codes) while
	// keeping existing variant classes as a fallback.
	const hexToRgb = (hex) => {
		if (!hex) throw new Error("Invalid hex");
		let h = hex.replace("#", "").trim();
		if (h.length === 3) {
			h = h
				.split("")
				.map((c) => c + c)
				.join("");
		}
		const int = parseInt(h, 16);
		return {
			r: (int >> 16) & 255,
			g: (int >> 8) & 255,
			b: int & 255,
		};
	};

	const hexToRgba = (hex, alpha = 1) => {
		try {
			const { r, g, b } = hexToRgb(hex);
			return `rgba(${r}, ${g}, ${b}, ${alpha})`;
		} catch (e) {
			return hex;
		}
	};

	// Choose black or white text depending on background luminance.
	const getContrastColor = (hex) => {
		try {
			const { r, g, b } = hexToRgb(hex);
			const yiq = (r * 299 + g * 587 + b * 114) / 1000;
			return yiq >= 128 ? "#ffffff" : "#ffffff";
		} catch (e) {
			return "#000000";
		}
	};

	// Use the raw hex color as the badge background when provided.
	// This preserves the original color hue/intensity the DB stores
	// instead of blending it with white via a low-alpha rgba.
	// Border uses a translucent variant for subtle separation.
	const customStyle = color
		? {
				backgroundColor: color,
				color: getContrastColor(color),
				borderColor: hexToRgba(color, 0.2),
		  }
		: undefined;

	return (
		<span
			className={cn(
				"inline-flex items-center font-medium rounded-full",
				// only apply the variant classes when no explicit color is provided
				!color && variants[variant],
				sizes[size],
				className
			)}
			style={customStyle}
			{...props}>
			{children}
		</span>
	);
}
