import { cn } from "@/utils";

/**
 * Komponen Card dengan animasi hover dan styling modern
 * Dapat digunakan sebagai container untuk menampilkan konten dalam bentuk kartu
 *
 * @param {Object} props - Props untuk Card component
 * @param {React.ReactNode} props.children - Konten di dalam card
 * @param {string} [props.className] - Class CSS tambahan
 * @param {boolean} [props.hover=true] - Apakah card memiliki efek hover animasi
 * @param {...any} props - Props tambahan yang akan di-forward ke element div
 * @returns {JSX.Element} Card component dengan animasi
 */
export default function Card({ children, className, hover = true, ...props }) {
	return (
		<div
			className={cn(
				"bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl p-6",
				"shadow-lg hover:shadow-xl hover:scale-105 transition-transform ease-out duration-300 ",
				" border-gradient",
				className
			)}
			{...props}>
			{children}
		</div>
	);
}

/**
 * Sub-komponen untuk header section dalam Card
 * @param {Object} props - Props untuk CardHeader
 * @param {React.ReactNode} props.children - Konten header
 * @param {string} [props.className] - Class CSS tambahan
 * @returns {JSX.Element} Header section card
 */
function CardHeader({ children, className, ...props }) {
	return (
		<div className={cn("mb-6", className)} {...props}>
			{children}
		</div>
	);
}

/**
 * Sub-komponen untuk title dalam Card
 * @param {Object} props - Props untuk CardTitle
 * @param {React.ReactNode} props.children - Konten title
 * @param {string} [props.className] - Class CSS tambahan
 * @returns {JSX.Element} Title element card
 */
function CardTitle({ children, className, ...props }) {
	return (
		<h3
			className={cn("text-xl font-bold text-gray-900 leading-tight", className)}
			{...props}>
			{children}
		</h3>
	);
}

/**
 * Sub-komponen untuk description/subtitle dalam Card
 * @param {Object} props - Props untuk CardDescription
 * @param {React.ReactNode} props.children - Konten description
 * @param {string} [props.className] - Class CSS tambahan
 * @returns {JSX.Element} Description element card
 */
function CardDescription({ children, className, ...props }) {
	return (
		<p
			className={cn("text-gray-600 text-sm leading-relaxed", className)}
			{...props}>
			{children}
		</p>
	);
}

/**
 * Sub-komponen untuk content body dalam Card
 * @param {Object} props - Props untuk CardContent
 * @param {React.ReactNode} props.children - Konten body
 * @param {string} [props.className] - Class CSS tambahan
 * @returns {JSX.Element} Content section card
 */
function CardContent({ children, className, ...props }) {
	return (
		<div className={cn("space-y-4", className)} {...props}>
			{children}
		</div>
	);
}

/**
 * Sub-komponen untuk footer section dalam Card
 * @param {Object} props - Props untuk CardFooter
 * @param {React.ReactNode} props.children - Konten footer
 * @param {string} [props.className] - Class CSS tambahan
 * @returns {JSX.Element} Footer section card
 */
function CardFooter({ children, className, ...props }) {
	return (
		<div
			className={cn(
				"mt-6 pt-4 border-t border-gray-100 flex items-center justify-between",
				className
			)}
			{...props}>
			{children}
		</div>
	);
}
