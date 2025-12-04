import { useState } from "react";

// UI Libraries
import { motion } from "framer-motion";
import { AsyncImage } from "loadable-image";
import { Fade } from "transitions-kit";
import { Building2, MapPin, Mail, Phone, Globe, Star, CheckCircle, Search } from "lucide-react";

// Hooks
import { useOrganizations } from "@/_hooks/useOrganizations";
import { useDocumentTitle } from "@/_hooks/useDocumentTitle";

// Helpers
import { getImageUrl } from "@/utils";

// UI Components
import DynamicButton from "@/components/ui/Button";
import Skeleton from "@/components/ui/Skeleton";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";

export default function OrganizationsPage() {
	useDocumentTitle("Organizations Page");
	
	const {
		data: organizations = [],
		isLoading,
		error,
	} = useOrganizations({ status_verifikasi: "verified" });

	const [searchTerm, setSearchTerm] = useState("");

	// Filter organizations based on search
	const filteredOrganizations = organizations.filter(
		(org) =>
			org.nama?.toLowerCase().includes(searchTerm.toLowerCase()) ||
			org.kota?.toLowerCase().includes(searchTerm.toLowerCase()) ||
			org.deskripsi?.toLowerCase().includes(searchTerm.toLowerCase())
	);

	if (error) {
		return (
			<div className="page-transition min-h-screen py-8 bg-gradient-to-br from-emerald-50 via-white to-teal-50">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center py-12">
						<div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
							<Building2 className="w-8 h-8 text-red-600" />
						</div>
						<h2 className="text-2xl font-bold text-red-600 mb-4">Gagal Memuat Organisasi</h2>
						<p className="text-gray-600 mb-6">
							{error.message || "Terjadi kesalahan saat mengambil data organisasi."}
						</p>
						<DynamicButton onClick={() => window.location.reload()} variant="primary">
							Coba Lagi
						</DynamicButton>
					</div>
				</div>
			</div>
		);
	}

	if (isLoading) {
		return <Skeleton.OrgSkeleton />;
	}

	return (
		<div className="page-transition min-h-screen py-8 bg-gradient-to-br from-blue-50 via-green-50 to-purple-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Hero Header */}
				<div className="mb-8 text-center">
					<h1 className="text-4xl lg:text-5xl font-bold  text-emerald-600 mb-4">
						Organisasi Komunitas
					</h1>
					<p className="text-xl text-gray-600 max-w-2xl mx-auto">
						Bergabunglah dengan berbagai organisasi komunitas yang berkontribusi untuk membuat
						perubahan positif di masyarakat
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
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
							/>
						</div>
					</Card>
				</div>

				{/* Organizations List */}
				{filteredOrganizations.length === 0 ? (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						className="text-center py-12">
						<div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
							<Search className="w-8 h-8 text-gray-400" />
						</div>
						<h3 className="text-xl font-semibold text-gray-900 mb-2">
							Tidak ada organisasi ditemukan
						</h3>
						<p className="text-gray-600">Coba ubah kata kunci pencarian Anda</p>
					</motion.div>
				) : (
					<div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
						{filteredOrganizations.map((org, index) => (
							<motion.div
								key={org.id}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.5, delay: index * 0.1 }}>
								<Card className="h-full hover:shadow-xl transition-all duration-300 group cursor-pointer overflow-hidden">
									{/* Organization Banner */}
									<div className="relative h-40 bg-gradient-to-br rounded-lg from-emerald-400 to-teal-500 overflow-hidden">
										{org.logo && (
											<AsyncImage
												loading="lazy"
												Transition={Fade}
												src={getImageUrl(`organizations/${org.logo}`)}
												alt={`${org.nama} banner`}
												className="object-cover w-full h-full opacity-40 group-hover:opacity-60 transition-opacity"
												onError={(e) => {
													e.currentTarget.style.display = "none";
												}}
											/>
										)}
										<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

										{/* Verified Badge */}
										{org.status_verifikasi === "verified" && (
											<Badge
												variant="success"
												className="absolute top-3 right-3 text-black backdrop-blur-sm shadow-lg">
												<CheckCircle className="w-3 h-3 mr-1" />
												Terverifikasi
											</Badge>
										)}
									</div>

									{/* Organization Logo Avatar */}
									<div className="px-6 -mt-16 relative z-10">
										<div className="w-24 h-24 rounded-2xl bg-white border-4 border-white shadow-xl overflow-hidden flex items-center justify-center">
											{org.logo ? (
												<AsyncImage
													loading="lazy"
													Transition={Fade}
													src={getImageUrl(`organizations/${org.logo}`)}
													alt={`${org.nama} logo`}
													className="object-cover w-full h-full"
													onError={(e) => {
														e.currentTarget.parentElement.innerHTML = `
															<div class="text-emerald-600 font-bold text-2xl">
																${String(org.nama || "A")
																	.split(" ")
																	.map((s) => s[0])
																	.slice(0, 2)
																	.join("")}
															</div>
														`;
													}}
												/>
											) : (
												<div className="text-emerald-600 font-bold text-2xl">
													{String(org.nama || "Anonymous")
														.split(" ")
														.map((s) => s[0])
														.slice(0, 2)
														.join("")}
												</div>
											)}
										</div>
									</div>

									{/* Content */}
									<div className="px-6 pt-4 pb-6">
										{/* Organization Name */}
										<h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">
											{org.nama}
										</h3>

										{/* Location */}
										{org.kota && (
											<div className="flex items-center text-gray-600 mb-4">
												<MapPin className="w-4 h-4 mr-2 text-emerald-500" />
												<span className="text-sm font-medium">{org.kota}</span>
											</div>
										)}

										{/* Description */}
										{org.deskripsi && (
											<p className="text-gray-700 mb-4 line-clamp-3 leading-relaxed">
												{org.deskripsi}
											</p>
										)}

										{/* Rating */}
										{org.rating != null && (
											<div className="flex items-center gap-1 mb-5 pb-5 border-b border-gray-100">
												<Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
												<span className="font-bold text-gray-900 text-lg">
													{Number(org.rating).toFixed(1)}
												</span>
												<span className="text-gray-500 text-sm">/5.0</span>
											</div>
										)}

										{/* Contact Links */}
										<div className="flex items-center gap-4 flex-wrap">
											{org.email && (
												<a
													href={`mailto:${org.email}`}
													className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors font-medium text-sm"
													onClick={(e) => e.stopPropagation()}>
													<Mail className="w-4 h-4" />
													Email
												</a>
											)}
											{org.telepon && (
												<a
													href={`tel:${org.telepon}`}
													className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-teal-50 text-teal-700 hover:bg-teal-100 transition-colors font-medium text-sm"
													onClick={(e) => e.stopPropagation()}>
													<Phone className="w-4 h-4" />
													Telepon
												</a>
											)}
											{org.website && (
												<a
													href={
														org.website.startsWith("http") ? org.website : `https://${org.website}`
													}
													target="_blank"
													rel="noreferrer"
													className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors font-medium text-sm"
													onClick={(e) => e.stopPropagation()}>
													<Globe className="w-4 h-4" />
													Website
												</a>
											)}
										</div>
									</div>
								</Card>
							</motion.div>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
