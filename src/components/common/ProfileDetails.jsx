import { motion } from "framer-motion";
import {
	User,
	Mail,
	Phone,
	MapPin,
	Calendar,
	Award,
	Star,
	Code,
	Building2,
	Globe,
	Shield,
} from "lucide-react";

import Card from "@/components/ui/Card";
import { formatDate } from "@/utils/dateFormatter";
import {
	getVolunteerEventBadge,
	getOrganizationEventBadge,
	getOrganizationVerificationBadge,
	parseSkillsArray,
} from "@/utils";

const containerVariants = {
	hidden: { opacity: 0, y: 20 },
	visible: { opacity: 1, y: 0 },
};

const itemVariants = {
	hidden: { opacity: 0, y: 20 },
	visible: { opacity: 1, y: 0 },
};

export default function ProfileDetails({ profile, role = "volunteer" }) {
	// role: 'volunteer' | 'organization' | 'admin'
	const skills = parseSkillsArray(profile?.keahlian || "");

	return (
		<motion.div variants={itemVariants} className="xl:col-span-3">
			<Card>
				{/* Informasi Personal / Pengguna */}
				<div className="mb-8">
					<div className="flex items-center mb-6">
						<User className="w-5 h-5 text-blue-500 mr-2" />
						<h3 className="text-lg font-bold text-gray-900">
							Informasi {role === "organization" ? "Pengguna" : "Personal"}
						</h3>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div className="space-y-4">
							<div>
								<label className="text-xs font-medium text-gray-500 block mb-1">Nama Lengkap</label>
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
									<p className="text-gray-900 text-sm">{profile?.email || "Belum ditambahkan"}</p>
								</div>
							</div>

							<div>
								<label className="text-xs font-medium text-gray-500 block mb-1">
									Nomor Telepon
								</label>
								<div className="flex items-center">
									<Phone className="w-3 h-3 text-gray-400 mr-2" />
									<p className="text-gray-900 text-sm">{profile?.telepon || "Belum ditambahkan"}</p>
								</div>
							</div>
						</div>

						<div className="space-y-4">
							<div>
								<label className="text-xs font-medium text-gray-500 block mb-1">Alamat</label>
								<div className="flex items-start">
									<MapPin className="w-3 h-3 text-gray-400 mr-2 mt-0.5" />
									<p className="text-gray-900 text-sm">{profile?.alamat || "Belum ditambahkan"}</p>
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
								<label className="text-xs font-medium text-gray-500 block mb-1">Status Akun</label>
								<span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
									<div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1"></div>
									Aktif
								</span>
							</div>
						</div>
					</div>
				</div>

				<div className="border-t border-gray-200 mb-8"></div>

				{role === "organization" ? (
					// Organization-specific section
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
				) : role === "admin" ? (
					// Volunteer/Admin shared additional section
					<div>
						<div className="flex items-center mb-6">
							<Award className="w-5 h-5 text-purple-500 mr-2" />
							<h3 className="text-lg font-bold text-gray-900">Informasi Tambahan</h3>
						</div>

						<div className="space-y-4">
							<div>
								<label className="text-xs font-medium text-gray-500 block mb-1">Bio</label>
								<p className="text-gray-900 text-sm leading-relaxed">
									{profile?.bio || "Belum ada bio yang ditambahkan"}
								</p>
							</div>

							<div>
								<label className="text-xs font-medium text-gray-500 block mb-3">
									Keahlian & Kemampuan
								</label>
								{skills?.length > 0 ? (
									<div className="space-y-3">
										<div className="flex flex-wrap gap-2">
											{skills.map((skill, index) => (
												<span
													key={index}
													className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-200">
													<Star className="w-3 h-3 mr-1.5 text-blue-500" />
													{skill}
												</span>
											))}
										</div>
										<div className="flex items-center text-xs text-gray-500">
											<Code className="w-3 h-3 mr-1" />
											<span>{skills.length} keahlian terdaftar</span>
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
				) : (
					<div>
						<div className="flex items-center mb-6">
							<Award className="w-5 h-5 text-purple-500 mr-2" />
							<h3 className="text-lg font-bold text-gray-900">Informasi Tambahan</h3>
						</div>

						<div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
							<div className="space-y-4">
								<div>
									<label className="text-xs font-medium text-gray-500 block mb-1">Bio</label>
									<p className="text-gray-900 text-sm leading-relaxed">
										{profile?.bio || "Belum ada bio yang ditambahkan"}
									</p>
								</div>

								<div>
									<label className="text-xs font-medium text-gray-500 block mb-3">
										Keahlian & Kemampuan
									</label>
									{skills?.length > 0 ? (
										<div className="space-y-3">
											<div className="flex flex-wrap gap-2">
												{skills.map((skill, index) => (
													<span
														key={index}
														className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-200">
														<Star className="w-3 h-3 mr-1.5 text-blue-500" />
														{skill}
													</span>
												))}
											</div>
											<div className="flex items-center text-xs text-gray-500">
												<Code className="w-3 h-3 mr-1" />
												<span>{skills.length} keahlian terdaftar</span>
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

							<div className="space-y-4">
								<div>
									<label className="text-xs font-medium text-gray-500 block mb-1">
										Event yang Diikuti
									</label>
									<div className="flex items-center space-x-3">
										{(() => {
											const badge = getVolunteerEventBadge(
												profile?.analytics?.events_participated_count
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
															{profile?.analytics?.events_participated_count || 0} Event
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
										Level Volunteer
									</label>
									{(() => {
										const badge = getVolunteerEventBadge(profile?.events_participated_count);
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
				)}
			</Card>
		</motion.div>
	);
}
