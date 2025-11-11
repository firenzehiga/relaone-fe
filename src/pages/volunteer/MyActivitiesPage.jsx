import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
	ArrowLeft,
	Calendar,
	CheckCircle,
	XCircle,
	Clock,
	Sparkles,
} from "lucide-react";
import { useVolunteerHistory } from "@/_hooks/useParticipants";
import Card from "@/components/ui/Card";
import DynamicButton from "@/components/ui/Button";
import Skeleton from "@/components/ui/Skeleton";
import ActivityCard from "@/components/volunteer/ActivityCard";

export default function MyActivitiesPage() {
	const navigate = useNavigate();
	const [activeTab, setActiveTab] = useState("all");
	const { data, isLoading, error } = useVolunteerHistory();

	if (isLoading) {
		return <Skeleton.MyActivitiesSkeleton />;
	}

	if (error) {
		return (
			<div className="flex justify-center items-center min-h-screen">
				<div className="text-center">
					<div className="text-6xl mb-4">⚠️</div>
					<p className="text-gray-600 text-lg">Gagal memuat data aktivitas</p>
					<button
						onClick={() => window.location.reload()}
						className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
						Coba Lagi
					</button>
				</div>
			</div>
		);
	}

	// Tab configuration dengan icon & color
	const tabs = [
		{
			id: "all",
			label: "Semua",
			Icon: Sparkles,
			count: data?.statistics?.total || 0,
			color: "text-gray-600",
		},
		{
			id: "pending",
			label: "Menunggu",
			Icon: Clock,
			count: data?.pending?.length || 0,
			color: "text-amber-600",
		},
		{
			id: "upcoming",
			label: "Akan Datang",
			Icon: Calendar,
			count: data?.upcoming?.length || 0,
			color: "text-blue-600",
		},
		{
			id: "ongoing",
			label: "Berlangsung",
			Icon: CheckCircle,
			count: data?.ongoing?.length || 0,
			color: "text-orange-600",
		},
		{
			id: "completed",
			label: "Selesai",
			Icon: CheckCircle,
			count: data?.completed?.length || 0,
			color: "text-green-600",
		},
	];

	const getCurrentData = () => {
		if (!data) return [];
		return data[activeTab] || [];
	};

	const currentData = getCurrentData();

	return (
		<div className="page-transition min-h-screen py-8 bg-gradient-to-br from-slate-50 via-white to-emerald-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Header */}
				<div className="mb-8">
					<div className="flex items-center gap-3 mb-2">
						<DynamicButton
							variant="ghost"
							size="sm"
							onClick={() => navigate("/")}
							className="p-2">
							<ArrowLeft size={20} />
						</DynamicButton>
						<h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
							Aktivitas Saya
						</h1>
					</div>
					<p className="text-xl text-gray-600 ml-12">
						Kelola partisipasi event volunteer kamu
					</p>
				</div>

				{/* Statistics Card */}
				<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.1 }}>
						<Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg hover:shadow-xl transition-shadow">
							<div className="flex items-center justify-between p-5">
								<div>
									<p className="text-blue-100 text-sm font-medium mb-1">
										Total Event
									</p>
									<p className="text-4xl font-bold">
										{data?.statistics?.total || 0}
									</p>
								</div>
								<Sparkles size={40} className="opacity-80" />
							</div>
						</Card>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.2 }}>
						<Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-lg hover:shadow-xl transition-shadow">
							<div className="flex items-center justify-between p-5">
								<div>
									<p className="text-green-100 text-sm font-medium mb-1">
										Hadir
									</p>
									<p className="text-4xl font-bold">
										{data?.statistics?.attended || 0}
									</p>
								</div>
								<CheckCircle size={40} className="opacity-80" />
							</div>
						</Card>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.3 }}>
						<Card className="bg-gradient-to-br from-red-500 to-red-600 text-white border-0 shadow-lg hover:shadow-xl transition-shadow">
							<div className="flex items-center justify-between p-5">
								<div>
									<p className="text-red-100 text-sm font-medium mb-1">
										Tidak Hadir
									</p>
									<p className="text-4xl font-bold">
										{data?.statistics?.no_show || 0}
									</p>
								</div>
								<XCircle size={40} className="opacity-80" />
							</div>
						</Card>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.4 }}>
						<Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0 shadow-lg hover:shadow-xl transition-shadow">
							<div className="flex items-center justify-between p-5">
								<div>
									<p className="text-orange-100 text-sm font-medium mb-1">
										Ditolak
									</p>
									<p className="text-4xl font-bold">
										{data?.statistics?.rejected || 0}
									</p>
								</div>
								<XCircle size={40} className="opacity-80" />
							</div>
						</Card>
					</motion.div>
				</div>

				{/* Tabs */}
				<Card className="mb-8 p-0 overflow-hidden bg-white border border-gray-200 shadow-lg">
					<div className="overflow-x-auto">
						<div className="flex gap-2 p-3 min-w-max bg-gray-50">
							{tabs.map((tab) => {
								const IconComponent = tab.Icon;
								return (
									<motion.button
										key={tab.id}
										onClick={() => setActiveTab(tab.id)}
										whileHover={{ scale: 1.02 }}
										whileTap={{ scale: 0.98 }}
										className={`
											flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all whitespace-nowrap
											${
												activeTab === tab.id
													? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg"
													: "bg-white text-gray-700 hover:bg-gray-100 shadow-sm border border-gray-200"
											}
										`}>
										<IconComponent
											size={18}
											className={
												activeTab === tab.id ? "text-white" : tab.color
											}
										/>
										<span className="font-semibold">{tab.label}</span>
										<span
											className={`
											px-2.5 py-0.5 rounded-full text-xs font-bold
											${activeTab === tab.id ? "bg-white/20 text-white" : "bg-gray-200 text-gray-700"}
										`}>
											{tab.count}
										</span>
									</motion.button>
								);
							})}
						</div>
					</div>
				</Card>

				{/* Activity List */}
				<div className="space-y-6">
					{currentData.length === 0 ? (
						<motion.div
							initial={{ opacity: 0, scale: 0.9 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ duration: 0.3 }}>
							<Card className="p-16 text-center bg-white border border-gray-200 shadow-lg">
								<div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
									<Calendar className="text-gray-400" size={48} />
								</div>
								<h3 className="text-2xl font-bold text-gray-900 mb-3">
									Belum Ada Aktivitas
								</h3>
								<p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
									Kamu belum memiliki aktivitas di kategori ini. Yuk mulai
									berkontribusi dengan mengikuti event volunteer!
								</p>
								<DynamicButton
									variant="success"
									size="lg"
									onClick={() => navigate("/events")}>
									<Sparkles size={18} className="mr-2" />
									Jelajahi Event
								</DynamicButton>
							</Card>
						</motion.div>
					) : (
						currentData.map((item, index) => (
							<motion.div
								key={item.id}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: index * 0.05 }}>
								<ActivityCard
									data={item}
									onClick={() =>
										navigate(`/volunteer/my-activities/${item.id}`)
									}
								/>
							</motion.div>
						))
					)}
				</div>
			</div>
		</div>
	);
}
