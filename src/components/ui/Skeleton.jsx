import { motion } from "framer-motion";
import { cn } from "@/utils";
import { Loader2 } from "lucide-react";
import {
	Skeleton as ChkSkeleton,
	SkeletonCircle,
	SkeletonText as ChkSkeletonText,
} from "@chakra-ui/react";
import Card from "./Card";

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
function SkeletonDetail() {
	return (
		<div className="min-h-screen bg-white">
			<div className="max-w-7xl mx-auto p-6">
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
		</div>
	);
}

Skeleton.Detail = SkeletonDetail;

function FormSkeleton({ title = "", rows = 6 }) {
	return (
		<div className="max-w-7xl mx-auto p-6">
			<div className="bg-white shadow-lg rounded-lg p-6" style={{ width: 950 }}>
				<div className="flex items-center justify-center gap-3 mb-4">
					<Loader2 className="animate-spin h-7 w-7 text-emerald-500" />
					<div className="text-sm font-medium text-gray-700">{title}</div>
				</div>
				<form className="space-y-6">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div className="h-10 bg-gray-100 rounded animate-pulse" />
						<div className="h-10 bg-gray-100 rounded animate-pulse" />
					</div>

					<div className="h-10 bg-gray-100 rounded animate-pulse" />
					<div className="h-20 bg-gray-100 rounded animate-pulse" />

					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<div className="h-10 bg-gray-100 rounded animate-pulse" />
						<div className="h-10 bg-gray-100 rounded animate-pulse" />
						<div className="h-10 bg-gray-100 rounded animate-pulse" />
					</div>

					{Array.from({ length: rows }).map((_, i) => (
						<div key={i} className="h-10 bg-gray-100 rounded animate-pulse" />
					))}

					<div className="flex items-center justify-end gap-3">
						<div className="h-10 w-24 bg-gray-100 rounded animate-pulse" />
						<div className="h-10 w-32 bg-gray-100 rounded animate-pulse" />
					</div>
				</form>
			</div>
		</div>
	);
}
Skeleton.FormSkeleton = FormSkeleton;

function OrgSkeleton() {
	return (
		<div className="page-transition min-h-screen py-8 bg-gradient-to-br from-slate-50 via-white to-blue-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="mb-8">
					<h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
						Organisasi Komunitas
					</h1>
					<p className="text-xl text-gray-600">
						Jelajahi berbagai organisasi komunitas yang berkontribusi pada
						masyarakat
					</p>
				</div>

				<div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
					{Array.from({ length: 6 }).map((_, i) => (
						<div
							key={i}
							className="flex gap-4 p-6 bg-white rounded-xl border shadow-sm animate-pulse"
							aria-hidden>
							<div className="w-20 h-20 rounded-lg bg-slate-200" />
							<div className="flex-1 space-y-3">
								<div className="h-5 bg-slate-200 rounded w-3/4" />
								<div className="h-4 bg-slate-200 rounded w-1/2" />
								<div className="h-3 bg-slate-200 rounded w-2/3" />
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
Skeleton.OrgSkeleton = OrgSkeleton;

// Komponen Skeleton untuk ProfilePage
function ProfileSkeleton() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-4 px-4">
			<div className="max-w-7xl mx-auto">
				{/* Header Skeleton */}
				<div className="text-center mb-6">
					<ChkSkeleton height="32px" width="200px" mx="auto" mb={2} />
					<ChkSkeleton height="16px" width="300px" mx="auto" />
				</div>

				<div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
					{/* Profile Card Skeleton */}
					<div className="xl:col-span-1">
						<Card className="text-center h-fit">
							{/* Avatar Skeleton */}
							<div className="relative mb-4">
								<SkeletonCircle size="128px" mx="auto" />
							</div>

							{/* Basic Info Skeleton */}
							<ChkSkeleton height="24px" width="150px" mx="auto" mb={2} />
							<ChkSkeleton height="16px" width="200px" mx="auto" mb={4} />

							{/* Edit Button Skeleton */}
							<ChkSkeleton height="32px" width="100%" borderRadius="lg" />
						</Card>
					</div>

					{/* Details Section Skeleton */}
					<div className="xl:col-span-3">
						<Card>
							<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
								{/* Personal Information Skeleton */}
								<div>
									<div className="flex items-center mb-4">
										<ChkSkeleton width="20px" height="20px" mr={2} />
										<ChkSkeleton height="24px" width="150px" />
									</div>

									<div className="space-y-3">
										{[...Array(6)].map((_, index) => (
											<div key={index}>
												<ChkSkeleton height="12px" width="80px" mb={1} />
												<div className="flex items-center">
													<ChkSkeleton width="12px" height="12px" mr={2} />
													<ChkSkeleton height="16px" width="120px" />
												</div>
											</div>
										))}
									</div>
								</div>

								{/* Additional Information Skeleton */}
								<div>
									<div className="flex items-center mb-4">
										<ChkSkeleton width="20px" height="20px" mr={2} />
										<ChkSkeleton height="24px" width="180px" />
									</div>

									<div className="space-y-3">
										{[...Array(4)].map((_, index) => (
											<div key={index}>
												<ChkSkeleton height="12px" width="60px" mb={1} />
												<ChkSkeletonText
													mt={1}
													noOfLines={index === 0 ? 2 : 1}
													spacing="2"
													skeletonHeight="2"
												/>
											</div>
										))}
									</div>
								</div>
							</div>
						</Card>
					</div>
				</div>
			</div>
		</div>
	);
}
Skeleton.ProfileSkeleton = ProfileSkeleton;
