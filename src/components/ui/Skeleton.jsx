import { motion } from "framer-motion";
import { cn } from "../../utils/cn";

export default function Skeleton({ className, ...props }) {
	return (
		<motion.div
			animate={{
				opacity: [0.5, 1, 0.5],
			}}
			transition={{
				duration: 1.5,
				repeat: Infinity,
				ease: "easeInOut",
			}}
			className={cn("bg-gray-300 rounded", className)}
			{...props}
		/>
	);
}

// Preset skeleton components
function SkeletonCard({ className }) {
	return (
		<div
			className={cn(
				"bg-gray-400 border border-gray-500 rounded-lg p-6",
				className
			)}>
			<Skeleton className="h-4 w-3/4 mb-4" />
			<Skeleton className="h-3 w-full mb-2" />
			<Skeleton className="h-3 w-2/3 mb-4" />
			<div className="flex justify-between items-center">
				<Skeleton className="h-6 w-20" />
				<Skeleton className="h-8 w-24" />
			</div>
		</div>
	);
}

function SkeletonEventCard({ className }) {
	return (
		<div
			className={cn(
				"bg-gray-400 border border-gray-500 rounded-lg overflow-hidden",
				className
			)}>
			<Skeleton className="h-48 w-full" />
			<div className="p-4">
				<Skeleton className="h-5 w-3/4 mb-2" />
				<Skeleton className="h-3 w-full mb-2" />
				<Skeleton className="h-3 w-2/3 mb-4" />
				<div className="flex justify-between items-center">
					<Skeleton className="h-6 w-16" />
					<Skeleton className="h-8 w-20" />
				</div>
			</div>
		</div>
	);
}

function SkeletonLine({ className }) {
	return <Skeleton className={cn("h-4 w-full", className)} />;
}

function SkeletonText({ lines = 3, className }) {
	return (
		<div className={className}>
			{Array.from({ length: lines }).map((_, i) => (
				<Skeleton
					key={i}
					className={cn("h-3 mb-2", i === lines - 1 ? "w-2/3" : "w-full")}
				/>
			))}
		</div>
	);
}

Skeleton.Card = SkeletonCard;
Skeleton.EventCard = SkeletonEventCard;
Skeleton.Line = SkeletonLine;
Skeleton.Text = SkeletonText;
