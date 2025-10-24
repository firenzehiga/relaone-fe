import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

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
			className={cn("bg-slate-200 rounded", className)}
			{...props}
		/>
	);
}

// Preset skeleton components
function SkeletonCard({ className }) {
	return (
		<div className={cn("bg-slate-200 border rounded-lg p-6", className)}>
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
				"bg-slate-300 border rounded-lg overflow-hidden",
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

// Detail page skeleton (slate accent)
function SkeletonDetail({ className }) {
	return (
		<div className={cn("space-y-6", className)}>
			<div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
				{/* Left image */}
				<div className="md:col-span-5">
					<div className="rounded-lg overflow-hidden">
						<Skeleton className="h-72 md:h-[640px] w-full bg-slate-200" />
					</div>
				</div>

				{/* Right content */}
				<div className="md:col-span-7 space-y-4">
					<div className="flex items-start justify-between">
						<div className="space-y-3 w-full">
							<div className="flex items-center gap-3">
								<Skeleton className="h-6 w-20 rounded-full bg-slate-100" />
								<div className="flex-1">
									<Skeleton className="h-8 w-3/4 bg-slate-200" />
									<Skeleton className="h-4 w-1/2 mt-2 bg-slate-200" />
								</div>
							</div>

							<div className="flex items-center gap-6 mt-3">
								<Skeleton className="h-4 w-40 bg-slate-200" />
								<Skeleton className="h-4 w-24 bg-slate-200" />
							</div>
						</div>
					</div>

					<div className="pt-2">
						<Skeleton className="h-4 w-full bg-slate-200" />
						<Skeleton className="h-4 w-5/6 mt-2 bg-slate-200" />
						<Skeleton className="h-4 w-4/6 mt-2 bg-slate-200" />
					</div>

					<div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="border rounded-lg p-4">
							<Skeleton className="h-5 w-36 bg-amber-100" />
							<div className="mt-3 space-y-2">
								<Skeleton className="h-3 w-full bg-slate-200" />
								<Skeleton className="h-3 w-full bg-slate-200" />
								<Skeleton className="h-3 w-3/4 bg-slate-200" />
								<Skeleton className="h-3 w-2/3 bg-slate-200" />
							</div>
						</div>

						<div className="border rounded-lg p-4">
							<Skeleton className="h-5 w-28 bg-slate-100" />
							<div className="mt-3 space-y-2">
								<Skeleton className="h-3 w-full bg-slate-200" />
								<Skeleton className="h-3 w-full bg-slate-200" />
								<Skeleton className="h-3 w-3/4 bg-slate-200" />
								<Skeleton className="h-3 w-2/3 bg-slate-200" />
							</div>
						</div>
					</div>

					<div className="mt-4">
						<div className="border rounded-lg p-4 flex items-center gap-4">
							<Skeleton className="h-12 w-12 rounded-full bg-slate-200" />
							<div className="flex-1">
								<Skeleton className="h-4 w-1/3 bg-slate-200" />
								<Skeleton className="h-3 w-1/2 mt-2 bg-slate-200" />
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

Skeleton.Detail = SkeletonDetail;
