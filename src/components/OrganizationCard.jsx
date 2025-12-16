import { AsyncImage } from "loadable-image";
import { Fade } from "transitions-kit";
import { CheckCircle, MapPin, Mail, Phone, Globe, Star } from "lucide-react";
import Badge from "./ui/Badge";
import Card from "./ui/Card";
import { getImageUrl } from "@/utils";
import DynamicButton from "./ui/Button";

export default function OrganizationCard({ organization, onClick, className = "" }) {
	if (!organization) return null;

	return (
		<Card
			className={`h-full hover:shadow-xl transition-all duration-300 group overflow-hidden flex flex-col cursor-pointer ${className}`}
			onClick={() => onClick?.(organization.id)}>
			<div className="relative h-32 bg-gradient-to-br rounded-t-lg from-emerald-400 to-teal-500 overflow-hidden">
				{organization.logo && (
					<AsyncImage
						loading="lazy"
						Transition={Fade}
						src={getImageUrl(`organizations/${organization.logo}`)}
						alt={`${organization.nama} banner`}
						className="object-cover w-full h-full opacity-40 group-hover:opacity-60 transition-opacity"
						onError={(e) => {
							e.currentTarget.style.display = "none";
						}}
					/>
				)}
				<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

				{organization.status_verifikasi === "verified" && (
					<Badge
						variant="success"
						className="absolute top-2 right-2 text-xs backdrop-blur-sm shadow-lg">
						<CheckCircle className="w-3 h-3 mr-1" />
						Verified
					</Badge>
				)}
			</div>

			<div className="px-4 -mt-12 relative z-10">
				<div className="w-20 h-20 rounded-xl bg-white border-4 border-white shadow-xl overflow-hidden flex items-center justify-center">
					{organization.logo ? (
						<AsyncImage
							loading="lazy"
							Transition={Fade}
							src={getImageUrl(`organizations/${organization.logo}`)}
							alt={`${organization.nama} logo`}
							className="object-cover w-full h-full"
							onError={(e) => {
								e.currentTarget.parentElement.innerHTML = `
									<div class="text-emerald-600 font-bold text-xl">
										${String(organization.nama || "A")
											.split(" ")
											.map((s) => s[0])
											.slice(0, 2)
											.join("")}
									</div>
								`;
							}}
						/>
					) : (
						<div className="text-emerald-600 font-bold text-xl">
							{String(organization.nama || "Anonymous")
								.split(" ")
								.map((s) => s[0])
								.slice(0, 2)
								.join("")}
						</div>
					)}
				</div>
			</div>

			<div className="px-4 pt-3 pb-4 flex-1 flex flex-col">
				<h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors line-clamp-2">
					{organization.nama}
				</h3>

				{organization.kota && (
					<div className="flex items-center text-gray-600 mb-3">
						<MapPin className="w-3 h-3 mr-1 text-emerald-500" />
						<span className="text-xs font-medium truncate">{organization.kota}</span>
					</div>
				)}

				{organization.deskripsi && (
					<p className="text-gray-700 text-sm mb-3 line-clamp-3 leading-relaxed flex-1">
						{organization.deskripsi}
					</p>
				)}

				{organization.rating != null && (
					<div className="flex items-center gap-1 mb-3 pb-3 border-b border-gray-100">
						<Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
						<span className="font-bold text-gray-900 text-sm">
							{Number(organization.rating).toFixed(1)}
						</span>
						<span className="text-gray-500 text-xs">/5.0</span>
					</div>
				)}

				<div className="space-y-2 mb-3">
					<p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Kontak</p>
					<div className="flex items-center gap-2 flex-wrap">
						{organization.email && (
							<a
								href={`mailto:${organization.email}`}
								className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-all text-xs border border-emerald-200"
								onClick={(e) => e.stopPropagation()}
								title={organization.email}>
								<Mail className="w-3 h-3" />
								Email
							</a>
						)}
						{organization.telepon && (
							<a
								href={`tel:${organization.telepon}`}
								className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-teal-50 text-teal-700 hover:bg-teal-100 transition-all text-xs border border-teal-200"
								onClick={(e) => e.stopPropagation()}
								title={organization.telepon}>
								<Phone className="w-3 h-3" />
								Call
							</a>
						)}
						{organization.website && (
							<a
								href={
									organization.website.startsWith("http")
										? organization.website
										: `https://${organization.website}`
								}
								target="_blank"
								rel="noreferrer"
								className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-blue-50 text-blue-700 hover:bg-blue-100 transition-all text-xs border border-blue-200"
								onClick={(e) => e.stopPropagation()}>
								<Globe className="w-3 h-3" />
								Web
							</a>
						)}
					</div>
				</div>

				<div className="mt-2">
					<DynamicButton
						variant="success"
						onClick={() => navigate(`/organizations/details/${organization.id}`)}
						className="w-full py-2 text-sm font-semibold">
						Pelajari Lebih Lanjut
					</DynamicButton>
				</div>
			</div>
		</Card>
	);
}
