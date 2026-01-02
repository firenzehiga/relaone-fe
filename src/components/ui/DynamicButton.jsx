import { motion } from "framer-motion";
import { cn } from "@/utils";
import { Link } from "react-router-dom";

/**
 * Komponen Button yang dapat dikustomisasi dengan berbagai variant, size, dan state
 * Dilengkapi dengan animasi dari Framer Motion dan loading state
 *
 * @param {Object} props - Props untuk Button component
 * @param {React.ReactNode} props.children - Konten yang ditampilkan di dalam button
 * @param {string} [props.variant="primary"] - Variant tampilan button (primary, secondary, outline, ghost, success, danger)
 * @param {string} [props.size="md"] - Ukuran button (sm, md, lg, xl)
 * @param {boolean} [props.disabled=false] - Status disabled button
 * @param {boolean} [props.loading=false] - Status loading button, akan menampilkan spinner
 * @param {string} [props.className] - Class CSS tambahan untuk styling kustom
 * @param {...any} props - Props tambahan yang akan di-forward ke element button
 * @returns {JSX.Element} Button component dengan animasi dan styling
 */
export default function DynamicButton({
	children,
	variant = "primary",
	size = "md",
	disabled = false,
	loading = false,
	className,
	...props
}) {
	const baseClasses =
		"inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95";

	const variants = {
		primary:
			"bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl focus:ring-blue-500",
		secondary:
			"bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 shadow-md hover:shadow-lg focus:ring-gray-300",
		outline:
			"border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-700 hover:text-gray-900 focus:ring-gray-300 shadow-sm hover:shadow-md bg-white",
		ghost: "hover:bg-emerald-50 text-emerald-600 hover:text-emerald-700 focus:ring-emerald-500",
		teal: "bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white shadow-lg hover:shadow-xl focus:ring-teal-500",
		warning:
			"bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg hover:shadow-xl focus:ring-amber-500",
		success:
			"bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl focus:ring-emerald-500",
		danger:
			"bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white shadow-lg hover:shadow-xl focus:ring-red-500",
	};

	const sizes = {
		sm: "px-3 py-2 text-sm",
		md: "px-4 py-2 text-base",
		lg: "px-6 py-3 text-base",
		xl: "px-8 py-4 text-lg",
	};

	return (
		<motion.button
			whileHover={{ scale: disabled ? 1 : 1.02 }}
			whileTap={{ scale: disabled ? 1 : 0.98 }}
			className={cn(baseClasses, variants[variant], sizes[size], className)}
			disabled={disabled || loading}
			{...props}>
			{loading && (
				<svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
					<circle
						className="opacity-25"
						cx="12"
						cy="12"
						r="10"
						stroke="currentColor"
						strokeWidth="4"></circle>
					<path
						className="opacity-75"
						fill="currentColor"
						d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
				</svg>
			)}
			{children}
		</motion.button>
	);
}

export function LinkButton({
	children,
	to,
	variant = "primary",
	size = "md",
	disabled = false,
	loading = false,
	className,
	...props
}) {
	const baseClasses =
		"inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95";
	const variants = {
		primary:
			"bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl focus:ring-blue-500",
		secondary:
			"bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 shadow-md hover:shadow-lg focus:ring-gray-300",
		outline:
			"border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-700 hover:text-gray-900 focus:ring-gray-300 shadow-sm hover:shadow-md bg-white",
		ghost: "hover:bg-emerald-50 text-emerald-600 hover:text-emerald-700 focus:ring-emerald-500",
		teal: "bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white shadow-lg hover:shadow-xl focus:ring-teal-500",
		warning:
			"bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg hover:shadow-xl focus:ring-amber-500",
		success:
			"bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl focus:ring-emerald-500",
		danger:
			"bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white shadow-lg hover:shadow-xl focus:ring-red-500",
	};
	const sizes = {
		sm: "px-3 py-2 text-sm",
		md: "px-4 py-2 text-sm",
		lg: "px-6 py-3 text-base",
		xl: "px-8 py-4 text-lg",
	};
	return (
		<Link
			to={to}
			className={cn(baseClasses, variants[variant], sizes[size], className)}
			disabled={disabled || loading}
			{...props}>
			{loading && (
				<svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
					<circle
						className="opacity-25"
						cx="12"
						cy="12"
						r="10"
						stroke="currentColor"
						strokeWidth="4"></circle>
					<path
						className="opacity-75"
						fill="currentColor"
						d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
				</svg>
			)}
			{children}
		</Link>
	);
}
