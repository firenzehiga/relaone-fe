import { motion } from "framer-motion";
import { cn } from "../../utils/cn";

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
export default function Button({
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
			"bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl focus:ring-blue-500",
		secondary:
			"bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 shadow-md hover:shadow-lg focus:ring-gray-300",
		outline:
			"border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-700 hover:text-gray-900 focus:ring-gray-300 shadow-sm hover:shadow-md bg-white",
		ghost:
			"hover:bg-blue-50 text-blue-600 hover:text-blue-700 focus:ring-blue-500",
		success:
			"bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl focus:ring-green-500",
		danger:
			"bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white shadow-lg hover:shadow-xl focus:ring-red-500",
	};

	const sizes = {
		sm: "px-3 py-2 text-sm",
		md: "px-4 py-2 text-sm",
		lg: "px-6 py-3 text-base",
		xl: "px-8 py-4 text-lg",
	};

	const MotionButton = motion.button;

	return (
		<MotionButton
			whileHover={{ scale: disabled ? 1 : 1.02 }}
			whileTap={{ scale: disabled ? 1 : 0.98 }}
			className={cn(baseClasses, variants[variant], sizes[size], className)}
			disabled={disabled || loading}
			{...props}>
			{loading && (
				<svg
					className="animate-spin -ml-1 mr-2 h-4 w-4"
					fill="none"
					viewBox="0 0 24 24">
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
		</MotionButton>
	);
}
