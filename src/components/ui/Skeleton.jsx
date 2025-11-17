import { motion } from "framer-motion";
import { cn } from "@/utils";
import {
	AlertCircle,
	ArrowLeft,
	Camera,
	Clock,
	Loader2,
	QrCodeIcon,
	Scan,
	Search,
} from "lucide-react";
import {
	Skeleton as ChkSkeleton,
	SkeletonCircle,
	SkeletonText as ChkSkeletonText,
} from "@chakra-ui/react";
import Card from "./Card";
import Avatar from "./Avatar";

export default function Skeleton({ className, ...props }) {
	return (
		<motion.div
			animate={{
				opacity: [0.6, 1, 0.6],
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
				"bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-lg",
				className
			)}>
			{/* Banner */}
			<div className="relative h-48 overflow-hidden">
				<ChkSkeleton height="100%" width="100%" />
				{/* Status badge */}
				<div className="absolute top-3 left-3">
					<ChkSkeleton height="20px" width="82px" borderRadius="full" />
				</div>
				{/* Category badge */}
				<div className="absolute top-3 right-3">
					<ChkSkeleton height="20px" width="92px" borderRadius="full" />
				</div>
			</div>

			<div className="p-6">
				{/* Title */}
				<ChkSkeleton height="20px" width="70%" mb={3} />

				{/* Short description */}
				<ChkSkeleton height="14px" width="100%" mb={2} />
				<ChkSkeleton height="14px" width="80%" mb={4} />

				{/* Details (date, location, participants) */}
				<div className="space-y-3 mb-6">
					<div className="flex items-center text-sm">
						<ChkSkeleton height="16px" width="16px" mr={3} />
						<ChkSkeleton height="16px" width="60%" />
					</div>

					<div className="flex items-start text-sm">
						<ChkSkeleton height="16px" width="16px" mr={3} />
						<div className="flex-1">
							<ChkSkeleton height="14px" width="50%" mb={2} />
							<ChkSkeleton height="12px" width="100%" mb={1} />
							<ChkSkeleton height="12px" width="60%" />
						</div>
					</div>

					<div className="flex items-center text-sm">
						<ChkSkeleton height="16px" width="16px" mr={3} />
						<ChkSkeleton height="16px" width="40%" />
					</div>
				</div>

				{/* Action buttons */}
				<div className="flex gap-3">
					<ChkSkeleton height="40px" width="100%" borderRadius="lg" />
					<ChkSkeleton height="40px" width="100%" borderRadius="lg" />
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

function FormSkeleton({ title = "", rows = 4 }) {
	return (
		<div className="w-full mx-auto p-4 sm:p-6 min-h-[calc(100vh-4rem)]">
			<div className="bg-white shadow-lg rounded-lg p-4 sm:p-6 max-w-7xl mx-auto">
				<div className="flex items-center justify-center gap-3 mb-6">
					<Loader2 className="animate-spin h-6 w-6 sm:h-7 sm:w-7 text-emerald-500" />
					<div className="text-sm sm:text-base font-medium text-gray-700">
						{title}
					</div>
				</div>
				<form className="space-y-6 flex flex-col">
					{/* Responsive 2-column grid */}
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
						<div className="h-10 bg-gray-100 rounded animate-pulse" />
						<div className="h-10 bg-gray-100 rounded animate-pulse" />
					</div>

					{/* Full width fields */}
					<div className="h-10 bg-gray-100 rounded animate-pulse" />
					<div className="h-20 bg-gray-100 rounded animate-pulse" />

					{/* Responsive 3-column grid */}
					<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
						<div className="h-10 bg-gray-100 rounded animate-pulse" />
						<div className="h-10 bg-gray-100 rounded animate-pulse" />
						<div className="h-10 bg-gray-100 rounded animate-pulse" />
					</div>

					{/* Additional rows */}
					{Array.from({ length: rows }).map((_, i) => (
						<div key={i} className="h-10 bg-gray-100 rounded animate-pulse" />
					))}

					{/* Responsive buttons - full width on mobile, auto on desktop */}
					<div className="flex flex-col sm:flex-row items-center justify-end gap-3 mt-auto pt-6">
						<div className="h-10 w-full sm:w-24 bg-gray-100 rounded animate-pulse" />
						<div className="h-10 w-full sm:w-32 bg-gray-100 rounded animate-pulse" />
					</div>
				</form>
			</div>
		</div>
	);
}
Skeleton.FormSkeleton = FormSkeleton;

function OrgSkeleton() {
	return (
		<div className="page-transition min-h-screen py-8 bg-gradient-to-br from-emerald-50 via-white to-teal-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Hero Header */}
				<div className="mb-8 text-center">
					<h1 className="text-4xl lg:text-5xl font-bold text-emerald-600 mb-4">
						Organisasi Komunitas
					</h1>
					<p className="text-xl text-gray-600 max-w-2xl mx-auto">
						Bergabunglah dengan berbagai organisasi komunitas yang berkontribusi
						untuk membuat perubahan positif di masyarakat
					</p>
				</div>

				{/* Search Bar */}
				<div className="mb-8">
					<Card className="p-4">
						<div className="relative">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
							<input
								type="text"
								placeholder="Cari organisasi, lokasi, atau kata kunci..."
								disabled
								className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed outline-none"
							/>
						</div>
					</Card>
				</div>

				{/* Organizations Grid - 2 columns on desktop */}
				<div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
					{Array.from({ length: 2 }).map((_, i) => (
						<Card
							key={i}
							className="h-full overflow-hidden animate-pulse"
							aria-hidden>
							{/* Banner with gradient */}
							<div className="relative h-40 bg-gradient-to-br from-emerald-400 to-teal-500 overflow-hidden">
								{/* Verified Badge */}
								<div className="absolute top-3 right-3">
									<ChkSkeleton
										height="24px"
										width="120px"
										borderRadius="full"
									/>
								</div>
							</div>

							{/* Logo Avatar - overlapping banner */}
							<div className="px-6 -mt-16 relative z-10 mb-4">
								<ChkSkeleton width="96px" height="96px" borderRadius="2xl" />
							</div>

							{/* Content */}
							<div className="px-6 pb-6">
								{/* Organization Name */}
								<ChkSkeleton height="28px" width="70%" mb={2} />

								{/* Location */}
								<div className="flex items-center mb-4">
									<ChkSkeleton width="16px" height="16px" mr={2} />
									<ChkSkeleton height="16px" width="120px" />
								</div>

								{/* Description - 3 lines */}
								<div className="mb-4 space-y-2">
									<ChkSkeleton height="14px" width="100%" />
									<ChkSkeleton height="14px" width="95%" />
									<ChkSkeleton height="14px" width="80%" />
								</div>

								{/* Rating */}
								<div className="flex items-center gap-2 mb-5 pb-5 border-b border-gray-100">
									<ChkSkeleton width="20px" height="20px" />
									<ChkSkeleton height="20px" width="60px" />
								</div>

								{/* Contact Buttons */}
								<div className="flex items-center gap-4 flex-wrap">
									<ChkSkeleton height="36px" width="80px" borderRadius="lg" />
									<ChkSkeleton height="36px" width="90px" borderRadius="lg" />
									<ChkSkeleton height="36px" width="85px" borderRadius="lg" />
								</div>
							</div>
						</Card>
					))}
				</div>
			</div>
		</div>
	);
}
Skeleton.OrgSkeleton = OrgSkeleton;

// Skeleton untuk Events Page (full page skeleton mirip EventsPage)
function EventsSkeleton() {
	return (
		<div className="page-transition min-h-screen py-8 bg-gradient-to-br from-emerald-50 via-white to-blue-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Hero Header - mirror actual EventsPage */}
				<div className="mb-8 text-center">
					<h1 className="text-4xl lg:text-5xl font-bold text-emerald-600 mb-4">
						Event Relawan
					</h1>
					<p className="text-xl text-gray-600">
						Temukan berbagai kegiatan sosial yang dapat Anda ikuti
					</p>
				</div>

				{/* Search and Filters Skeleton - mirror layout from EventsPage */}
				<div className="bg-white border border-gray-200 rounded-2xl p-6 mb-8 shadow-lg">
					<div className="mb-4">
						<div className="relative">
							<Search
								className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
								size={20}
							/>
							<input
								type="text"
								placeholder="Cari event berdasarkan nama, deskripsi, atau lokasi..."
								disabled
								className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 cursor-not-allowed"
							/>
						</div>
					</div>

					<div className="flex items-center justify-between">
						<div className="h-8 w-36 bg-gray-100 rounded-lg" />

						<div className="flex items-center gap-2">
							<div className="flex bg-gray-100 rounded-lg p-1">
								<div className="h-8 w-20 bg-gray-100 rounded-md" />
								<div className="h-8 w-16 bg-gray-100 rounded-md ml-2" />
							</div>
						</div>
					</div>
				</div>

				{/* Active Filters & Results count skeleton */}
				<div className="flex flex-wrap items-center gap-2 mb-6">
					<div className="h-4 w-32 bg-gray-100 rounded" />
				</div>

				{/* Cards grid skeleton */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{Array.from({ length: 3 }).map((_, i) => (
						<div key={i} className="animate-pulse">
							<SkeletonEventCard />
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
Skeleton.EventsSkeleton = EventsSkeleton;

// Komponen Skeleton untuk ProfilePage
function ProfileSkeleton() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-4 px-4">
			<div className="max-w-7xl mx-auto">
				{/* Header Skeleton */}
				<div className="text-center mb-6">
					<Skeleton className="h-6 w-36 mx-auto mb-2 bg-slate-200 animate-pulse" />
					<Skeleton className="h-4 w-72 mx-auto bg-slate-200 animate-pulse" />
				</div>

				{/* Gunakan staggered animation untuk mengurangi lag */}
				<div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
					{/* Profile Card Skeleton */}
					<div className="xl:col-span-1">
						<Card className="text-center h-fit">
							{/* Avatar Skeleton */}
							<div className="relative mb-4">
								<Skeleton className="w-32 h-32 rounded-full mx-auto bg-slate-200 animate-pulse" />
							</div>

							{/* Basic Info Skeleton */}
							<Skeleton className="h-6 w-36 mx-auto mb-2 bg-slate-200 animate-pulse" />
							<Skeleton className="h-4 w-48 mx-auto mb-4 bg-slate-200 animate-pulse" />

							{/* Edit Button Skeleton */}
							<Skeleton className="h-8 w-full rounded-lg bg-slate-200 animate-pulse" />
							{/* Basic Info Skeleton */}
							<Skeleton className="h-6 w-36 mx-auto mb-2 bg-slate-200 animate-pulse" />
							<Skeleton className="h-4 w-48 mx-auto mb-4 bg-slate-200 animate-pulse" />

							{/* Edit Button Skeleton */}
							<Skeleton className="h-8 w-full rounded-lg bg-slate-200 animate-pulse" />
						</Card>
					</div>

					{/* Details Section Skeleton */}
					<div className="xl:col-span-3">
						<Card>
							<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
								{/* Personal Information Skeleton */}
								<div>
									<div className="flex items-center mb-4">
										<Skeleton className="w-5 h-5 mr-2 bg-slate-200 animate-pulse" />
										<Skeleton className="h-6 w-36 bg-slate-200 animate-pulse" />
									</div>

									<div className="space-y-3">
										{[...Array(6)].map((_, index) => (
											<div key={index}>
												<Skeleton className="h-3 w-20 mb-1 bg-slate-200 animate-pulse" />
												<div className="flex items-center">
													<Skeleton className="w-3 h-3 mr-2 bg-slate-200 animate-pulse" />
													<Skeleton className="h-4 w-28 bg-slate-200 animate-pulse" />
												</div>
											</div>
										))}
									</div>
									<div className="space-y-3">
										{[...Array(6)].map((_, index) => (
											<div key={index}>
												<Skeleton className="h-3 w-20 mb-1 bg-slate-200 animate-pulse" />
												<div className="flex items-center">
													<Skeleton className="w-3 h-3 mr-2 bg-slate-200 animate-pulse" />
													<Skeleton className="h-4 w-28 bg-slate-200 animate-pulse" />
												</div>
											</div>
										))}
									</div>
								</div>

								{/* Additional Information Skeleton */}
								<div>
									<div className="flex items-center mb-4">
										<Skeleton className="w-5 h-5 mr-2 bg-slate-200 animate-pulse" />
										<Skeleton className="h-6 w-44 bg-slate-200 animate-pulse" />
									</div>

									<div className="space-y-3">
										{[...Array(4)].map((_, index) => (
											<div key={index}>
												<Skeleton className="h-3 w-16 mb-1 bg-slate-200 animate-pulse" />
												<Skeleton
													className={`h-4 ${
														index === 0 ? "w-full" : "w-3/4"
													} bg-slate-200 animate-pulse`}
												/>
											</div>
										))}
									</div>
									<div className="space-y-3">
										{[...Array(4)].map((_, index) => (
											<div key={index}>
												<Skeleton className="h-3 w-16 mb-1 bg-slate-200 animate-pulse" />
												<Skeleton
													className={`h-4 ${
														index === 0 ? "w-full" : "w-3/4"
													} bg-slate-200 animate-pulse`}
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

// Komponen Skeleton untuk Dashboard Admin Analytics
function AnalyticsSkeleton() {
	return (
		<div className="space-y-8">
			{/* Header Section */}
			<div>
				<ChkSkeleton height="32px" width="250px" mb={4} />

				{/* Stats Cards Grid - 3 columns */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{Array.from({ length: 6 }).map((_, i) => (
						<div key={i} className="bg-white rounded-xl border shadow-sm p-6">
							<div className="flex items-start justify-between">
								<div className="flex-1">
									{/* Title */}
									<ChkSkeleton height="14px" width="120px" mb={2} />
									{/* Value */}
									<ChkSkeleton height="36px" width="80px" mb={3} />
									{/* Description */}
									<ChkSkeleton height="12px" width="150px" />
								</div>
								{/* Icon */}
								<ChkSkeleton width="48px" height="48px" borderRadius="lg" />
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Charts Section - 2 columns */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* Pie Chart 1 */}
				<Card>
					<ChkSkeleton height="24px" width="200px" mb={4} />
					<div
						className="flex items-center justify-center"
						style={{ height: 300 }}>
						<SkeletonCircle size="200px" />
					</div>
				</Card>

				{/* Pie Chart 2 */}
				<Card>
					<ChkSkeleton height="24px" width="220px" mb={4} />
					<div
						className="flex items-center justify-center"
						style={{ height: 300 }}>
						<SkeletonCircle size="200px" />
					</div>
				</Card>
			</div>

			{/* Line Charts Section - 2 columns */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* Line Chart 1 */}
				<Card>
					<ChkSkeleton height="24px" width="240px" mb={4} />
					<div className="space-y-3" style={{ height: 300 }}>
						<ChkSkeleton height="100%" width="100%" borderRadius="md" />
					</div>
				</Card>

				{/* Line Chart 2 */}
				<Card>
					<ChkSkeleton height="24px" width="260px" mb={4} />
					<div className="space-y-3" style={{ height: 300 }}>
						<ChkSkeleton height="100%" width="100%" borderRadius="md" />
					</div>
				</Card>
			</div>

			{/* Bar Chart Section - Full Width */}
			<Card>
				<ChkSkeleton height="24px" width="280px" mb={4} />
				<div className="space-y-3" style={{ height: 300 }}>
					<ChkSkeleton height="100%" width="100%" borderRadius="md" />
				</div>
			</Card>

			{/* Recent Activity Section - 2 columns */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* Recent Logins */}
				<Card>
					<ChkSkeleton height="24px" width="150px" mb={4} />
					<div className="space-y-3">
						{Array.from({ length: 5 }).map((_, i) => (
							<div
								key={i}
								className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
								<div className="flex-1">
									<ChkSkeleton height="16px" width="140px" mb={2} />
									<ChkSkeleton height="14px" width="180px" mb={1} />
									<ChkSkeleton height="12px" width="100px" />
								</div>
								<ChkSkeleton height="24px" width="60px" borderRadius="full" />
							</div>
						))}
					</div>
				</Card>

				{/* Most Active Users */}
				<Card>
					<ChkSkeleton height="24px" width="180px" mb={4} />
					<div className="space-y-3">
						{Array.from({ length: 5 }).map((_, i) => (
							<div
								key={i}
								className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
								<div className="flex-1">
									<ChkSkeleton height="16px" width="140px" mb={2} />
									<ChkSkeleton height="14px" width="180px" />
								</div>
								<div className="text-right">
									<ChkSkeleton height="24px" width="40px" mb={1} />
									<ChkSkeleton height="12px" width="50px" />
								</div>
							</div>
						))}
					</div>
				</Card>
			</div>
		</div>
	);
}
Skeleton.AnalyticsSkeleton = AnalyticsSkeleton;

// Komponen Skeleton untuk Halaman Event Scanner Organisasi
function EventScannerSkeleton() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-4 sm:py-8">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Back Button */}
				<div className="mb-4 sm:mb-6">
					<div className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors text-sm">
						<ArrowLeft className="w-4 h-4" />
						<span className="font-medium">Kembali ke Daftar Participants</span>
					</div>
				</div>
				{/* Event Scanner Header */}
				<div className="rounded-lg shadow-sm border p-4 sm:p-6 bg-yellow-50 border-yellow-200">
					<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
						<div className="flex items-center gap-3 w-full sm:w-auto">
							<div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-yellow-500 to-orange-500">
								<QrCodeIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
							</div>
							<div className="flex-1 min-w-0">
								<h1 className="text-lg sm:text-2xl font-bold text-gray-900 truncate">
									Scanner Check-in Event
								</h1>
								<p className="text-xs sm:text-sm mt-1 truncate text-yellow-700">
									Loading event..
								</p>
							</div>
						</div>
						<div className="w-full sm:w-auto">
							<span className="inline-flex items-center justify-center w-full sm:w-auto px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
								🕐 Loading
							</span>
						</div>
					</div>

					{/* Warning banner for non-ongoing events */}

					<div className="mt-4 p-3 rounded-lg border text-xs sm:text-sm bg-yellow-100 border-yellow-300 text-yellow-800">
						⚠️ Event belum dimulai. Scanner akan aktif saat event berlangsung.
					</div>
				</div>
				{/* Event Banner */}
				<div className="bg-white rounded-xl shadow-md overflow-hidden border-2 border-emerald-200">
					<ChkSkeleton height="300px" width="100%" />
					<div className="p-6 space-y-4">
						<ChkSkeleton height="32px" width="80%" />
						<div className="flex items-center gap-4">
							<ChkSkeleton width="24px" height="24px" />
							<ChkSkeleton height="16px" width="150px" />
						</div>
						<div className="flex items-center gap-4">
							<ChkSkeleton width="24px" height="24px" />
							<ChkSkeleton height="16px" width="200px" />
						</div>
						<ChkSkeletonText mt={4} noOfLines={3} spacing="2" />
					</div>
				</div>
			</div>
		</div>
	);
}
Skeleton.EventScannerSkeleton = EventScannerSkeleton;

// Loading skeleton that mirrors the EventScanner layout more closely
function LoadingEventScanner() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-4 sm:py-8">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Header */}
				<div className="mb-4 sm:mb-6">
					<div className="inline-flex items-center gap-2 text-gray-600 mb-4 transition-colors text-sm">
						<ArrowLeft className="w-4 h-4" />
						<span className="font-medium">Kembali ke Daftar Participants</span>
					</div>

					<div
						className={`rounded-lg shadow-sm border p-4 sm:p-6 bg-gray-50 border-gray-200`}>
						<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
							<div className="flex items-center gap-3 w-full sm:w-auto">
								<div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-gray-500 to-gray-500">
									<ChkSkeleton height="20px" width="20px" />
								</div>
							</div>
							<div className="flex-1 min-w-0">
								<ChkSkeleton height="20px" width="70%" mb={2} />
								<ChkSkeleton height="14px" width="40%" />
							</div>

							<div className="w-full sm:w-auto">
								<ChkSkeleton height="28px" width="120px" borderRadius="full" />
							</div>
						</div>

						{/* Warning banner */}
						<div className="mt-4 p-3 rounded-lg border text-xs sm:text-sm bg-gray-100 border-gray-300 text-gray-800">
							<ChkSkeleton height="20px" width="40%" />
						</div>
					</div>
				</div>
				{/* Stats Cards */}
				<div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
					{Array.from({ length: 4 }).map((_, i) => (
						<div
							key={i}
							className="bg-white rounded-xl shadow-md p-3 border-2 border-gray-200">
							<div className="flex items-center justify-between mb-4">
								<ChkSkeleton height="20px" width="120px" />
								<ChkSkeleton height="32px" width="30px" />
							</div>
							<ChkSkeleton width="35px" height="35px" borderRadius="lg" />
						</div>
					))}
				</div>
				<div className="bg-white rounded-xl shadow-md p-6 border-2 border-gray-200 mb-8">
					<div className="flex items-center justify-between mb-4">
						<ChkSkeleton height="20px" width="120px" />
						<div>
							<div className="flex items-center mb-2">
								<ChkSkeleton height="16px" width="100px" />
							</div>
							<div className="flex items-center gap-2">
								<ChkSkeleton height="13px" width="120px" />
								<ChkSkeleton height="13px" width="16px" />
							</div>
						</div>
					</div>
					<ChkSkeleton width="35px" height="35px" borderRadius="lg" />
				</div>

				{/* Main Content - Scanner & Recent Check-ins */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
					{/* QR Scanner */}
					<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
						<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-4">
							<h2 className="text-lg sm:text-xl font-semibold text-gray-800 flex items-center gap-2">
								<Scan className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
								Scanner Check-in
							</h2>
						</div>

						{/* Result Display */}

						<ChkSkeleton height="220px" width="550px" />
					</div>
					{/* Recent Check-ins List */}
					<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
						<div className="flex items-center justify-between mb-4">
							<h3 className="text-base sm:text-lg font-semibold text-gray-800 flex items-center gap-2">
								<Clock className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
								Check-in Terbaru
							</h3>

							<span className="text-xs sm:text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
								Live
							</span>
						</div>
						<ChkSkeleton height="220px" width="550px" />
					</div>
				</div>
			</div>
		</div>
	);
}

Skeleton.LoadingEventScanner = LoadingEventScanner;

// Skeleton untuk Activity Detail Page
function ActivityDetailSkeleton() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
			<div className="max-w-6xl mx-auto p-6 space-y-6">
				{/* Back Button */}
				<div className="mb-6">
					<ChkSkeleton height="40px" width="120px" borderRadius="lg" />
				</div>

				{/* Left Column - Event Banner & Info */}
				<div className="lg:col-span-2 space-y-6">
					{/* Status & Timeline */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="bg-white rounded-xl p-6 border-2 border-emerald-200">
							<ChkSkeleton height="20px" width="120px" mb={4} />
							<div className="space-y-3">
								{Array.from({ length: 2 }).map((_, i) => (
									<div key={i} className="flex items-center gap-3">
										<ChkSkeleton width="32px" height="32px" borderRadius="lg" />
										<div className="flex-1">
											<ChkSkeleton height="16px" width="100px" mb={1} />
											<ChkSkeleton height="14px" width="140px" />
										</div>
									</div>
								))}
							</div>
						</div>

						<div className="bg-white rounded-xl p-6 border-2 border-teal-200">
							<ChkSkeleton height="20px" width="100px" mb={4} />
							<div className="space-y-3">
								{Array.from({ length: 2 }).map((_, i) => (
									<div key={i} className="flex items-center gap-3">
										<ChkSkeleton
											width="32px"
											height="32px"
											borderRadius="full"
										/>
										<div className="flex-1">
											<ChkSkeleton height="16px" width="120px" mb={1} />
											<ChkSkeleton height="14px" width="160px" />
										</div>
									</div>
								))}
							</div>
						</div>
					</div>
					{/* Event Banner */}
					<div className="bg-white rounded-xl shadow-md overflow-hidden border-2 border-emerald-200">
						<ChkSkeleton height="300px" width="100%" />
						<div className="p-6 space-y-4">
							<ChkSkeleton height="32px" width="80%" />
							<div className="flex items-center gap-4">
								<ChkSkeleton width="24px" height="24px" />
								<ChkSkeleton height="16px" width="150px" />
							</div>
							<div className="flex items-center gap-4">
								<ChkSkeleton width="24px" height="24px" />
								<ChkSkeleton height="16px" width="200px" />
							</div>
							<ChkSkeletonText mt={4} noOfLines={3} spacing="2" />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
Skeleton.ActivityDetailSkeleton = ActivityDetailSkeleton;

// Skeleton untuk My Activities Page
function MyActivitiesSkeleton() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 py-8">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Hero Header */}
				<div className="mb-8 text-center">
					<ChkSkeleton height="48px" width="300px" mx="auto" mb={4} />
					<ChkSkeleton height="24px" width="500px" mx="auto" />
				</div>

				{/* Stats Cards */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
					{Array.from({ length: 3 }).map((_, i) => (
						<div
							key={i}
							className="bg-white rounded-xl shadow-md p-6 border-2 border-emerald-200">
							<div className="flex items-center justify-between mb-4">
								<ChkSkeleton width="48px" height="48px" borderRadius="lg" />
								<ChkSkeleton height="32px" width="60px" />
							</div>
							<ChkSkeleton height="20px" width="120px" />
						</div>
					))}
				</div>

				{/* Tabs */}
				<div className="bg-white rounded-xl shadow-md mb-6 border-2 border-emerald-200">
					<div className="flex border-b">
						{Array.from({ length: 4 }).map((_, i) => (
							<div
								key={i}
								className="flex-1 p-4 text-center border-r last:border-r-0">
								<ChkSkeleton height="20px" width="80px" mx="auto" />
							</div>
						))}
					</div>
				</div>

				{/* Activity Cards Grid */}
				<div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-6">
					{Array.from({ length: 3 }).map((_, i) => (
						<div
							key={i}
							className="bg-white rounded-xl shadow-md overflow-hidden border-2 border-emerald-200">
							{/* Image */}
							<ChkSkeleton height="200px" width="100%" />

							{/* Content */}
							<div className="p-4 space-y-3">
								<div className="flex items-start justify-between">
									<ChkSkeleton height="24px" width="70%" />
									<ChkSkeleton height="24px" width="60px" borderRadius="full" />
								</div>

								<div className="space-y-2">
									<div className="flex items-center gap-2">
										<ChkSkeleton width="16px" height="16px" />
										<ChkSkeleton height="14px" width="120px" />
									</div>
									<div className="flex items-center gap-2">
										<ChkSkeleton width="16px" height="16px" />
										<ChkSkeleton height="14px" width="150px" />
									</div>
									<div className="flex items-center gap-2">
										<ChkSkeleton width="16px" height="16px" />
										<ChkSkeleton height="14px" width="100px" />
									</div>
								</div>

								<div className="pt-3 border-t">
									<ChkSkeleton height="40px" width="100%" borderRadius="lg" />
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
Skeleton.MyActivitiesSkeleton = MyActivitiesSkeleton;
