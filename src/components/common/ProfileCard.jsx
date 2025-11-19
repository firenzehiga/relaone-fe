import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Edit3, Building2 } from "lucide-react";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import {
	getImageUrl,
	getOrganizationEventBadge,
	getOrganizationVerificationBadge,
	getVolunteerEventBadge,
} from "@/utils";

const itemVariants = {
	hidden: { opacity: 0, y: 20 },
	visible: { opacity: 1, y: 0 },
};

export default function ProfileCard({ profile, role = "volunteer" }) {
	const badgeVol = getVolunteerEventBadge(profile?.analytics?.events_participated_count);
	const BadgeIconVol = badgeVol.icon;

	return (
		<motion.div variants={itemVariants} className="xl:col-span-1">
			{role === "organization" ? (
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
							const badgeOrg = getOrganizationEventBadge(profile?.analytics?.events_created_count);
							const BadgeIconOrg = badgeOrg.icon;
							return (
								<div className="absolute -top-2 -right-2">
									<div
										className={`relative bg-gradient-to-r ${badgeOrg.bgGradient} p-2 rounded-full shadow-lg border-2 border-white group hover:scale-110 transition-transform duration-300`}>
										<BadgeIconOrg className="w-4 h-4 text-white" />

										{/* Tooltip */}
										<div className="absolute bottom-full right-0 mb-2 w-36 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
											<div className="bg-gray-900 text-white text-xs rounded-lg py-2 px-3 shadow-lg">
												<div className="font-semibold">{badgeOrg.title}</div>
												<div className="text-gray-300">{badgeOrg.subtitle}</div>
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
					<p className="text-gray-600 mb-3 text-sm">{profile?.email || "Email tidak tersedia"}</p>

					{/* Edit Button */}
					<Link to="/organization/profile/edit">
						<Button variant="success" className="w-full" size="sm">
							<Edit3 className="w-3 h-3 mr-2" />
							Edit Profile
						</Button>
					</Link>
				</Card>
			) : role === "admin" ? (
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
							<div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-emerald-500 rounded-full mx-auto flex items-center justify-center border-4 border-white shadow-lg">
								<User className="w-16 h-16 text-white" />
							</div>
						)}
						<div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
							<span className="px-2 py-1 rounded-full text-xs font-medium border bg-orange-100 text-orange-800 border-orange-200">
								Administrator
							</span>
						</div>
					</div>

					{/* Basic Info - Compact */}
					<h2 className="text-lg font-bold text-gray-900 mb-1">
						{profile?.nama || "Nama tidak tersedia"}
					</h2>
					<p className="text-gray-600 mb-3 text-sm">{profile?.email || "Email tidak tersedia"}</p>

					{/* Edit Button */}
					<Link to="/admin/profile/edit">
						<Button variant="success" className="w-full" size="sm">
							<Edit3 className="w-3 h-3 mr-2" />
							Edit Profile
						</Button>
					</Link>
				</Card>
			) : (
				<Card className="text-center h-fit">
					<div className="relative mb-4">
						{profile?.foto_profil ? (
							<img
								src={getImageUrl(`foto_profil/${profile?.foto_profil}`)}
								alt="Avatar"
								className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-white shadow-lg"
							/>
						) : (
							<div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-green-500 rounded-full mx-auto flex items-center justify-center border-4 border-white shadow-lg">
								<User className="w-16 h-16 text-white" />
							</div>
						)}

						<div className="absolute -top-2 -right-2">
							<div
								className={`relative bg-gradient-to-r ${badgeVol.bgGradient} p-2 rounded-full shadow-lg border-2 border-white group hover:scale-110 transition-transform duration-300`}>
								<BadgeIconVol className="w-4 h-4 text-white" />

								<div className="absolute bottom-full right-0 mb-2 w-32 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
									<div className="bg-gray-900 text-white text-xs rounded-lg py-2 px-3 shadow-lg">
										<div className="font-semibold">{badgeVol.title}</div>
										<div className="text-gray-300">{badgeVol.subtitle}</div>
										<div className="absolute top-full right-3 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
									</div>
								</div>
							</div>
						</div>

						<div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
							<span className="px-2 py-1 rounded-full text-xs font-medium border bg-blue-100 text-blue-800 border-blue-200">
								Volunteer
							</span>
						</div>
					</div>

					<h2 className="text-lg font-bold text-gray-900 mb-1">
						{profile?.nama || "Nama tidak tersedia"}
					</h2>
					<p className="text-gray-600 mb-3 text-sm">{profile?.email || "Email tidak tersedia"}</p>

					<Link to="/volunteer/profile/edit">
						<Button variant="success" className="w-full" size="sm">
							<Edit3 className="w-3 h-3 mr-2" />
							Edit Profile
						</Button>
					</Link>
				</Card>
			)}
		</motion.div>
	);
}
