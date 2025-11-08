import { cn } from "@/utils";

/**
 * StatsCard Component
 * Komponen untuk menampilkan statistik dalam bentuk card dengan icon dan trend
 *
 * @param {Object} props - Props untuk StatsCard component
 * @param {string} props.title - Judul statistik
 * @param {string|number} props.value - Nilai statistik
 * @param {React.ReactNode} props.icon - Icon untuk statistik
 * @param {string} [props.description] - Deskripsi tambahan
 * @param {number} [props.trend] - Persentase trend (positif/negatif)
 * @param {string} [props.trendLabel] - Label untuk trend
 * @param {string} [props.color='blue'] - Warna tema card (blue, green, purple, orange, red)
 * @param {string} [props.className] - Class CSS tambahan
 * @returns {JSX.Element} StatsCard component
 */
export default function StatsCard({
	title,
	value,
	icon,
	description,
	trend,
	trendLabel,
	color = "blue",
	className,
}) {
	const colorVariants = {
		blue: {
			bg: "bg-blue-50",
			icon: "bg-blue-500",
			text: "text-blue-600",
			border: "border-blue-200",
		},
		green: {
			bg: "bg-green-50",
			icon: "bg-green-500",
			text: "text-green-600",
			border: "border-green-200",
		},
		purple: {
			bg: "bg-purple-50",
			icon: "bg-purple-500",
			text: "text-purple-600",
			border: "border-purple-200",
		},
		orange: {
			bg: "bg-orange-50",
			icon: "bg-orange-500",
			text: "text-orange-600",
			border: "border-orange-200",
		},
		red: {
			bg: "bg-red-50",
			icon: "bg-red-500",
			text: "text-red-600",
			border: "border-red-200",
		},
		indigo: {
			bg: "bg-indigo-50",
			icon: "bg-indigo-500",
			text: "text-indigo-600",
			border: "border-indigo-200",
		},
		pink: {
			bg: "bg-pink-50",
			icon: "bg-pink-500",
			text: "text-pink-600",
			border: "border-pink-200",
		},
		yellow: {
			bg: "bg-yellow-50",
			icon: "bg-yellow-500",
			text: "text-yellow-600",
			border: "border-yellow-200",
		},
	};

	const colors = colorVariants[color] || colorVariants.blue;

	return (
		<div
			className={cn(
				"bg-white rounded-xl border shadow-sm hover:shadow-md transition-all duration-200 p-6",
				colors.border,
				className
			)}>
			<div className="flex items-start justify-between">
				<div className="flex-1">
					<p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
					<h3 className="text-3xl font-bold text-gray-900 mb-2">{value}</h3>

					{description && (
						<p className="text-xs text-gray-500 mb-2">{description}</p>
					)}

					{trend !== undefined && (
						<div className="flex items-center gap-1">
							<span
								className={cn(
									"text-xs font-medium flex items-center gap-1",
									trend >= 0 ? "text-green-600" : "text-red-600"
								)}>
								{trend >= 0 ? (
									<svg
										className="w-3 h-3"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24">
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M5 10l7-7m0 0l7 7m-7-7v18"
										/>
									</svg>
								) : (
									<svg
										className="w-3 h-3"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24">
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M19 14l-7 7m0 0l-7-7m7 7V3"
										/>
									</svg>
								)}
								{Math.abs(trend)}%
							</span>
							{trendLabel && (
								<span className="text-xs text-gray-500">{trendLabel}</span>
							)}
						</div>
					)}
				</div>

				<div
					className={cn(
						"flex items-center justify-center w-12 h-12 rounded-lg",
						colors.icon
					)}>
					<div className="text-white">{icon}</div>
				</div>
			</div>
		</div>
	);
}
