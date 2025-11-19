import { cn } from "@/utils";

// ...existing code...
export default function RatingStars({
	rating = 0,
	maxRating = 5,
	size = "sm",
	interactive = false,
	showNumber = true,
	onRatingChange,
	className,
}) {
	const sizes = {
		sm: "w-4 h-4",
		md: "w-5 h-5",
		lg: "w-6 h-6",
		xl: "w-7 h-7",
	};

	// coerce rating ke number yang valid (fallback 0)
	const ratingValue = (() => {
		const n = Number(rating);
		return Number.isFinite(n) ? n : 0;
	})();

	const handleStarClick = (event, starValue) => {
		if (!interactive || !onRatingChange) return;

		const rect = event.currentTarget.getBoundingClientRect();
		const clickX = event.clientX - rect.left;
		const fraction = Math.max(0, Math.min(1, clickX / rect.width));
		const newRating = Math.round((starValue - 1 + fraction) * 10) / 10; // 1 desimal

		onRatingChange(newRating);
	};

	// simple filled star svg (supports fill)
	const StarSvg = ({ className, filled = false }) => (
		<svg
			className={className}
			viewBox="0 0 24 24"
			fill={filled ? "currentColor" : "none"}
			stroke="currentColor"
			strokeWidth="1.2"
			xmlns="http://www.w3.org/2000/svg"
			aria-hidden="true">
			<path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
		</svg>
	);

	return (
		<div className={cn("flex items-center space-x-1", className)}>
			{Array.from({ length: maxRating }).map((_, index) => {
				const starValue = index + 1;
				// gunakan ratingValue di sini
				const fillPercent = Math.max(0, Math.min(1, ratingValue - (starValue - 1))) * 100;

				return (
					<button
						type="button"
						key={index}
						onClick={(e) => handleStarClick(e, starValue)}
						disabled={!interactive}
						className={cn(
							"relative inline-block p-0 m-0 leading-0 border-0 bg-transparent",
							!interactive && "cursor-default"
						)}
						style={{ lineHeight: 0 }}
						aria-label={`Rate ${starValue}`}>
						{/* background (empty) star */}
						<StarSvg className={cn("text-gray-300", sizes[size])} filled={false} />
						{/* overlay filled portion */}
						<span
							style={{ width: `${fillPercent}%` }}
							className="absolute top-0 left-0 h-full overflow-hidden pointer-events-none">
							<StarSvg className={cn("text-yellow-400", sizes[size])} filled={true} />
						</span>
					</button>
				);
			})}
			{showNumber && <span className="text-sm text-gray-400 ml-2">({ratingValue.toFixed(1)})</span>}
		</div>
	);
}
