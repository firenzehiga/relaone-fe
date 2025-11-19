import { Link } from "react-router-dom";

// UI Libraries
import { motion } from "framer-motion";
import { User, Mail, Phone, MapPin, Calendar, Edit3, Shield, Building2, Globe } from "lucide-react";

// Hooks
import { useUserProfile } from "@/_hooks/useUsers";

// Helpers
import { getImageUrl, getOrganizationEventBadge, getOrganizationVerificationBadge } from "@/utils";

// UI Components
import Skeleton from "@/components/ui/Skeleton";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { formatDate } from "@/utils/dateFormatter";

/**
 * Halaman Profile Organization
 * Menampilkan informasi lengkap profile organization yang sedang login
 */

export default function OrganizationProfilePage() {
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
					<h2 className="text-xl font-bold text-gray-900 mb-2">Gagal Memuat Profile</h2>
					<p className="text-gray-600 mb-4">Terjadi kesalahan saat memuat data profile</p>
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

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-4 px-4">
			<motion.div
				className="max-w-7xl mx-auto"
				variants={containerVariants}
				initial="hidden"
				animate="visible">
				{/* Header Section - Compact */}
				<motion.div variants={itemVariants} className="text-center mb-6">
					<h1 className="text-2xl font-bold text-gray-900 mb-1">Profile Organisasi</h1>
					<p className="text-gray-600 text-sm">Kelola informasi profile organisasi Anda</p>
				</motion.div>

				<div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
					{/* Profile Card - Compact */}
					<motion.div variants={itemVariants} className="xl:col-span-1">
						<Card className="text-center h-fit">
							{/* Avatar - Larger */}
							<div className="relative mb-4">
								{profile?.role_data?.logo ? (
									<img
										src={getImageUrl(`organizations/${profile?.role_data?.logo}`)}
										alt="Organization Logo"
										className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-white shadow-lg"
									/>
								) : (
									<div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-green-500 rounded-full mx-auto flex items-center justify-center border-4 border-white shadow-lg">
										<Building2 className="w-16 h-16 text-white" />
									</div>
								)}

								{/* Event Badge - Top Right */}
								{(() => {
									const badge = getOrganizationEventBadge(profile?.analytics?.events_created_count);
									const BadgeIcon = badge.icon;
									return (
										<div className="absolute -top-2 -right-2">
											<div
												className={`relative bg-gradient-to-r ${badge.bgGradient} p-2 rounded-full shadow-lg border-2 border-white group hover:scale-110 transition-transform duration-300`}>
												<BadgeIcon className="w-4 h-4 text-white" />

												{/* Tooltip */}
												<div className="absolute bottom-full right-0 mb-2 w-36 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
													<div className="bg-gray-900 text-white text-xs rounded-lg py-2 px-3 shadow-lg">
														<div className="font-semibold">{badge.title}</div>
														<div className="text-gray-300">{badge.subtitle}</div>
														{/* Arrow */}
														<div className="absolute top-full right-3 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
													</div>
												</div>
											</div>
										</div>
									);
								})()}

								{/* Verification Badge - Top Left */}
								{(() => {
									const verificationBadge = getOrganizationVerificationBadge(
										profile?.role_data?.status_verifikasi
									);
									const VerificationIcon = verificationBadge.icon;
									return (
										<div className="absolute -top-2 -left-2">
											<div
												className={`relative ${verificationBadge.bgColor} p-2 rounded-full shadow-lg border-2 border-white group hover:scale-110 transition-transform duration-300`}>
												<VerificationIcon className="w-4 h-4 text-white" />

												{/* Tooltip */}
												<div className="absolute bottom-full left-0 mb-2 w-36 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
													<div className="bg-gray-900 text-white text-xs rounded-lg py-2 px-3 shadow-lg">
														<div className="font-semibold">{verificationBadge.title}</div>
														<div className="text-gray-300">{verificationBadge.description}</div>
														{/* Arrow */}
														<div className="absolute top-full left-3 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
													</div>
												</div>
											</div>
										</div>
									);
								})()}

								{/* Role Badge - Bottom */}
								<div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
									<span className="px-2 py-1 rounded-full text-xs font-medium border bg-green-100 text-green-800 border-green-200">
										Organisasi
									</span>
								</div>
							</div>

							{/* Basic Info - Compact */}
							<h2 className="text-lg font-bold text-gray-900 mb-1">
								{profile?.role_data?.nama || profile?.nama || "Nama tidak tersedia"}
							</h2>
							<p className="text-gray-600 mb-3 text-sm">
								{profile?.email || "Email tidak tersedia"}
							</p>

							{/* Edit Button */}
							<Link to="/organization/profile/edit">
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
									<h3 className="text-lg font-bold text-gray-900">Informasi Pengguna</h3>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									{/* Left Column - Personal Info */}
									<div className="space-y-4">
										<div>
											<label className="text-xs font-medium text-gray-500 block mb-1">
												Nama Lengkap
											</label>
											<p className="text-gray-900 font-medium text-sm">
												{profile?.nama || "Belum ditambahkan"}
											</p>
										</div>
										<div>
											<label className="text-xs font-medium text-gray-500 block mb-1">
												Jenis Kelamin
											</label>
											<p className="text-gray-900 font-medium text-sm">
												{profile?.jenis_kelamin || "Belum ditambahkan"}
											</p>
										</div>

										<div>
											<label className="text-xs font-medium text-gray-500 block mb-1">Email</label>
											<div className="flex items-center">
												<Mail className="w-3 h-3 text-gray-400 mr-2" />
												<p className="text-gray-900 text-sm">
													{profile?.email || "Belum ditambahkan"}
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
													{profile?.telepon || "Belum ditambahkan"}
												</p>
											</div>
										</div>
									</div>

									{/* Right Column - Additional Personal Info */}
									<div className="space-y-4">
										<div>
											<label className="text-xs font-medium text-gray-500 block mb-1">Alamat</label>
											<div className="flex items-start">
												<MapPin className="w-3 h-3 text-gray-400 mr-2 mt-0.5" />
												<p className="text-gray-900 text-sm">
													{profile?.alamat || "Belum ditambahkan"}
												</p>
											</div>
										</div>

										<div>
											<label className="text-xs font-medium text-gray-500 block mb-1">
												Tanggal Bergabung
											</label>
											<div className="flex items-center">
												<Calendar className="w-3 h-3 text-gray-400 mr-2" />
												<p className="text-gray-900 text-sm">{formatDate(profile?.created_at)}</p>
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

							{/* Informasi Organisasi Section */}
							<div>
								<div className="flex items-center mb-6">
									<Building2 className="w-5 h-5 text-purple-500 mr-2" />
									<h3 className="text-lg font-bold text-gray-900">Informasi Organisasi</h3>
								</div>

								<div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
									<div className="space-y-4">
										<div>
											<label className="text-xs font-medium text-gray-500 block mb-1">
												Nama Organisasi
											</label>
											<p className="text-gray-900 font-semibold text-sm">
												{profile?.role_data?.nama || "Tidak tersedia"}
											</p>
										</div>

										<div>
											<label className="text-xs font-medium text-gray-500 block mb-1">
												Deskripsi Organisasi
											</label>
											<p className="text-gray-900 text-sm leading-relaxed">
												{profile?.role_data?.deskripsi || "Belum ada deskripsi organisasi"}
											</p>
										</div>

										<div>
											<label className="text-xs font-medium text-gray-500 block mb-1">
												Website Organisasi
											</label>
											{profile?.role_data?.website ? (
												<div className="flex items-center">
													<Globe className="w-3 h-3 text-gray-400 mr-2" />
													<a
														href={
															profile.role_data.website.startsWith("http")
																? profile.role_data.website
																: `https://${profile.role_data.website}`
														}
														target="_blank"
														rel="noopener noreferrer"
														className="text-blue-600 hover:text-blue-800 text-sm underline">
														{profile.role_data.website}
													</a>
												</div>
											) : (
												<p className="text-gray-900 text-sm">Tidak tersedia</p>
											)}
										</div>
									</div>

									<div className="space-y-4">
										<div>
											<label className="text-xs font-medium text-gray-500 block mb-1">
												Event yang Dibuat
											</label>
											<div className="flex items-center space-x-3">
												{(() => {
													const badge = getOrganizationEventBadge(
														profile?.analytics?.events_created_count
													);
													const BadgeIcon = badge.icon;
													return (
														<>
															<div
																className={`flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r ${badge.bgGradient}`}>
																<BadgeIcon className="w-4 h-4 text-white" />
															</div>
															<div>
																<p className="text-gray-900 font-semibold text-sm">
																	{profile?.analytics?.events_created_count || 0} Event
																</p>
																<p className={`text-xs font-medium ${badge.color.split(" ")[1]}`}>
																	{badge.title}
																</p>
															</div>
														</>
													);
												})()}
											</div>
										</div>

										<div>
											<label className="text-xs font-medium text-gray-500 block mb-1">
												Status Verifikasi
											</label>
											{(() => {
												const verificationBadge = getOrganizationVerificationBadge(
													profile?.role_data?.status_verifikasi
												);
												return (
													<span
														className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${verificationBadge.color}`}>
														<verificationBadge.icon className="w-3 h-3 mr-1" />
														{verificationBadge.title}
													</span>
												);
											})()}
										</div>

										<div>
											<label className="text-xs font-medium text-gray-500 block mb-1">
												Level Organisasi
											</label>
											{(() => {
												const badge = getOrganizationEventBadge(
													profile?.analytics?.events_created_count
												);
												return (
													<span
														className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${badge.color}`}>
														<badge.icon className="w-3 h-3 mr-1" />
														{badge.title}
													</span>
												);
											})()}
										</div>
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
