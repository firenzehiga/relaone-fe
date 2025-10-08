import { cn } from "../../utils/cn";

const Avatar = ({ src, alt, size = "md", fallback, className, ...props }) => {
  const sizes = {
    sm: "w-8 h-8 text-sm",
    md: "w-10 h-10 text-base",
    lg: "w-12 h-12 text-lg",
    xl: "w-16 h-16 text-xl",
    "2xl": "w-20 h-20 text-2xl",
  };

  const getFallbackInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (src) {
    return (
      <img
        src={src}
        alt={alt || "Avatar"}
        className={cn(
          "rounded-full object-cover border-2 border-gray-600",
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }

  return (
    <div
      className={cn(
        "rounded-full bg-gray-600 flex items-center justify-center text-gray-200 font-medium border-2 border-gray-600",
        sizes[size],
        className
      )}
      {...props}
    >
      {getFallbackInitials(fallback)}
    </div>
  );
};

export default Avatar;
