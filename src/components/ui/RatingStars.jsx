import { Star } from "lucide-react";
import { cn } from "../../utils/cn";

const RatingStars = ({
  rating = 0,
  maxRating = 5,
  size = "sm",
  interactive = false,
  onRatingChange,
  className,
}) => {
  const sizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  const handleStarClick = (value) => {
    if (interactive && onRatingChange) {
      onRatingChange(value);
    }
  };

  return (
    <div className={cn("flex items-center space-x-1", className)}>
      {Array.from({ length: maxRating }).map((_, index) => {
        const starValue = index + 1;
        const isActive = starValue <= rating;

        return (
          <Star
            key={index}
            className={cn(
              "transition-colors",
              sizes[size],
              isActive ? "text-yellow-400 fill-current" : "text-gray-400",
              interactive && "cursor-pointer hover:text-yellow-300"
            )}
            onClick={() => handleStarClick(starValue)}
          />
        );
      })}
      <span className="text-sm text-gray-400 ml-2">({rating.toFixed(1)})</span>
    </div>
  );
};

export default RatingStars;
