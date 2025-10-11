import { cn } from "../../utils/cn";

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
const Badge = ({
	children,
	variant = "default",
	size = "sm",
	className,
	...props
}) => {
	const variants = {
		default: "bg-gray-100 text-gray-800 border border-gray-200",
		primary: "bg-blue-100 text-blue-800 border border-blue-200",
		success: "bg-green-100 text-green-800 border border-green-200",
		warning: "bg-yellow-100 text-yellow-800 border border-yellow-200",
		danger: "bg-red-100 text-red-800 border border-red-200",
		secondary: "bg-purple-100 text-purple-800 border border-purple-200",
		outline: "border border-gray-300 text-gray-700 bg-white",
	};

	const sizes = {
		sm: "px-2 py-1 text-xs",
		md: "px-3 py-1 text-sm",
		lg: "px-4 py-2 text-base",
	};

	return (
		<span
			className={cn(
				"inline-flex items-center font-medium rounded-full",
				variants[variant],
				sizes[size],
				className
			)}
			{...props}>
			{children}
		</span>
	);
};

export default Badge;
