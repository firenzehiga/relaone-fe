import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
	User,
	Mail,
	Phone,
	MapPin,
	Calendar,
	Edit3,
	Shield,
	Award,
	Star,
	Code,
} from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { useUserProfile } from "@/_hooks/useUsers";
import { getImageUrl, parseSkillsArray } from "@/utils";
import Skeleton from "@/components/ui/Skeleton";

/**
 * Halaman Profile Volunteer
 * Menampilkan informasi lengkap profile user yang sedang login
 */

export default function AdminProfilePage() {
	const { data: profile, isLoading, error } = useUserProfile();

	if (isLoading) {
		return <Skeleton.ProfileSkeleton />;
	}

	if (error) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
				<Card className="max-w-md text-center">
					<div className="text-red-500 mb-4">
						<Shield className="w-16 h-16 mx-auto mb-4" />
					</div>
					<h2 className="text-xl font-bold text-gray-900 mb-2">
						Gagal Memuat Profile
					</h2>
					<p className="text-gray-600 mb-4">
						Terjadi kesalahan saat memuat data profile
					</p>
					<Button onClick={() => refetch()} variant="success">
						Coba Lagi
					</Button>
				</Card>
			</div>
		);
	}

	const containerVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				duration: 0.6,
				staggerChildren: 0.1,
			},
		},
	};

	const itemVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: { opacity: 1, y: 0 },
	};

	const formatDate = (dateString) => {
		if (!dateString) return "Tidak tersedia";
		return new Date(dateString).toLocaleDateString("id-ID", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	};

	const getRoleDisplayName = (role) => {
		const roleMap = {
			volunteer: "Volunteer",
			organization: "Organisasi",
			admin: "Administrator",
		};
		return roleMap[role] || role;
	};

	const getRoleBadgeColor = (role) => {
		const colorMap = {
			volunteer: "bg-green-100 text-green-800 border-green-200",
			organization: "bg-blue-100 text-blue-800 border-blue-200",
			admin: "bg-purple-100 text-purple-800 border-purple-200",
		};
		return colorMap[role] || "bg-gray-100 text-gray-800 border-gray-200";
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-4 px-4">
			<motion.div
				className="max-w-7xl mx-auto"
				variants={containerVariants}
				initial="hidden"
				animate="visible">
				{/* Header Section - Compact */}
				<motion.div variants={itemVariants} className="text-center mb-6">
					<h1 className="text-2xl font-bold text-gray-900 mb-1">
						Profile Saya
					</h1>
					<p className="text-gray-600 text-sm">
						Kelola informasi profile Anda sebagai volunteer
					</p>
				</motion.div>

				<div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
					{/* Profile Card - Compact */}
					<motion.div variants={itemVariants} className="xl:col-span-1">
						<Card className="text-center h-fit">
							{/* Avatar - Larger */}
							<div className="relative mb-4">
								{profile?.foto_profil ? (
									<img
										src={getImageUrl(`foto_profil/${profile?.foto_profil}`)}
										alt="Avatar"
										className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-white shadow-lg"
									/>
								) : (
									<div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full mx-auto flex items-center justify-center border-4 border-white shadow-lg">
										<User className="w-16 h-16 text-white" />
									</div>
								)}
								<div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
									<span
										className={`px-2 py-1 rounded-full text-xs font-medium border ${getRoleBadgeColor(
											profile?.role
										)}`}>
										{getRoleDisplayName(profile?.role)}
									</span>
								</div>
							</div>

							{/* Basic Info - Compact */}
							<h2 className="text-lg font-bold text-gray-900 mb-1">
								{profile?.nama || "Nama tidak tersedia"}
							</h2>
							<p className="text-gray-600 mb-3 text-sm">
								{profile?.email || "Email tidak tersedia"}
							</p>

							{/* Edit Button */}
							<Link to="/admin/profile/edit">
								<Button variant="success" className="w-full" size="sm">
									<Edit3 className="w-3 h-3 mr-2" />
									Edit Profile
								</Button>
							</Link>
						</Card>
					</motion.div>

					{/* Details Section - Wider */}
					<motion.div variants={itemVariants} className="xl:col-span-3">
						{/* Combined Information Card */}
						<Card>
							{/* Informasi Personal Section */}
							<div className="mb-8">
								<div className="flex items-center mb-6">
									<User className="w-5 h-5 text-blue-500 mr-2" />
									<h3 className="text-lg font-bold text-gray-900">
										Informasi Personal
									</h3>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									{/* Left Column - Personal Info */}
									<div className="space-y-4">
										<div>
											<label className="text-xs font-medium text-gray-500 block mb-1">
												Nama Lengkap
											</label>
											<p className="text-gray-900 font-medium text-sm">
												{profile?.nama || "Tidak tersedia"}
											</p>
										</div>

										<div>
											<label className="text-xs font-medium text-gray-500 block mb-1">
												Email
											</label>
											<div className="flex items-center">
												<Mail className="w-3 h-3 text-gray-400 mr-2" />
												<p className="text-gray-900 text-sm">
													{profile?.email || "Tidak tersedia"}
												</p>
											</div>
										</div>

										<div>
											<label className="text-xs font-medium text-gray-500 block mb-1">
												Nomor Telepon
											</label>
											<div className="flex items-center">
												<Phone className="w-3 h-3 text-gray-400 mr-2" />
												<p className="text-gray-900 text-sm">
													{profile?.telepon || "Tidak tersedia"}
												</p>
											</div>
										</div>
									</div>

									{/* Right Column - Additional Personal Info */}
									<div className="space-y-4">
										<div>
											<label className="text-xs font-medium text-gray-500 block mb-1">
												Alamat
											</label>
											<div className="flex items-start">
												<MapPin className="w-3 h-3 text-gray-400 mr-2 mt-0.5" />
												<p className="text-gray-900 text-sm">
													{profile?.alamat || "Tidak tersedia"}
												</p>
											</div>
										</div>

										<div>
											<label className="text-xs font-medium text-gray-500 block mb-1">
												Tanggal Bergabung
											</label>
											<div className="flex items-center">
												<Calendar className="w-3 h-3 text-gray-400 mr-2" />
												<p className="text-gray-900 text-sm">
													{formatDate(profile?.created_at)}
												</p>
											</div>
										</div>

										<div>
											<label className="text-xs font-medium text-gray-500 block mb-1">
												Status Akun
											</label>
											<span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
												<div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1"></div>
												Aktif
											</span>
										</div>
									</div>
								</div>
							</div>

							{/* Divider */}
							<div className="border-t border-gray-200 mb-8"></div>

							{/* Informasi Tambahan Section */}
							<div>
								<div className="flex items-center mb-6">
									<Award className="w-5 h-5 text-purple-500 mr-2" />
									<h3 className="text-lg font-bold text-gray-900">
										Informasi Tambahan
									</h3>
								</div>

								<div className="space-y-4">
									<div>
										<label className="text-xs font-medium text-gray-500 block mb-1">
											Bio
										</label>
										<p className="text-gray-900 text-sm leading-relaxed">
											{profile?.bio || "Belum ada bio yang ditambahkan"}
										</p>
									</div>

									{/* Keahlian Section */}
									<div>
										<label className="text-xs font-medium text-gray-500 block mb-3">
											Keahlian & Kemampuan
										</label>
										{parseSkillsArray(profile?.keahlian)?.length > 0 ? (
											<div className="space-y-3">
												<div className="flex flex-wrap gap-2">
													{parseSkillsArray(profile?.keahlian).map(
														(skill, index) => (
															<span
																key={index}
																className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-200 hover:from-blue-100 hover:to-indigo-100 transition-colors">
																<Star className="w-3 h-3 mr-1.5 text-blue-500" />
																{skill}
															</span>
														)
													)}
												</div>
												<div className="flex items-center text-xs text-gray-500">
													<Code className="w-3 h-3 mr-1" />
													<span>
														{parseSkillsArray(profile?.keahlian).length}{" "}
														keahlian terdaftar
													</span>
												</div>
											</div>
										) : (
											<div className="text-center py-6 border-2 border-dashed border-gray-200 rounded-lg">
												<Star className="w-8 h-8 text-gray-300 mx-auto mb-2" />
												<p className="text-gray-500 text-sm mb-1">
													Belum ada keahlian yang ditambahkan
												</p>
												<p className="text-gray-400 text-xs">
													Tambahkan keahlian untuk melengkapi profile
												</p>
											</div>
										)}
									</div>
								</div>
							</div>
						</Card>
					</motion.div>
				</div>
			</motion.div>
		</div>
	);
}
