import { motion } from "framer-motion";
import { cn } from "../../utils/cn";

const Card = ({ children, className, hover = true, ...props }) => {
  const MotionDiv = motion.div;

  return (
    <MotionDiv
      whileHover={hover ? { y: -4, scale: 1.02 } : {}}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={cn(
        "bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl p-6",
        "shadow-lg hover:shadow-2xl transition-all duration-300",
        "hover:shadow-blue-500/10 border-gradient",
        className
      )}
      {...props}
    >
      {children}
    </MotionDiv>
  );
};

const CardHeader = ({ children, className, ...props }) => (
  <div className={cn("mb-6", className)} {...props}>
    {children}
  </div>
);

const CardTitle = ({ children, className, ...props }) => (
  <h3
    className={cn("text-xl font-bold text-gray-900 leading-tight", className)}
    {...props}
  >
    {children}
  </h3>
);

const CardDescription = ({ children, className, ...props }) => (
  <p
    className={cn("text-gray-600 text-sm leading-relaxed", className)}
    {...props}
  >
    {children}
  </p>
);

const CardContent = ({ children, className, ...props }) => (
  <div className={cn("space-y-4", className)} {...props}>
    {children}
  </div>
);

const CardFooter = ({ children, className, ...props }) => (
  <div
    className={cn(
      "mt-6 pt-4 border-t border-gray-100 flex items-center justify-between",
      className
    )}
    {...props}
  >
    {children}
  </div>
);

Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Description = CardDescription;
Card.Content = CardContent;
Card.Footer = CardFooter;

export default Card;
