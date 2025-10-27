import { useOrganizations } from "@/_hooks/useOrganizations";
import DynamicButton from "@/components/ui/Button";
import { getImageUrl } from "@/utils/cn";

export default function OrganizationsPage() {
	const {
		data: organizations,
		isLoading,
		error,
	} = useOrganizations({ status_verifikasi: "verified" });

	if (error) {
		return (
			<div className="page-transition min-h-screen py-8 bg-gradient-to-br from-slate-50 via-white to-blue-50">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center py-12">
						<h2 className="text-2xl font-bold text-red-600 mb-4">
							❌ Gagal Memuat Organizations
						</h2>
						<p className="text-gray-600 mb-6">
							{error.message ||
								"Terjadi kesalahan saat mengambil data organizations."}
						</p>
						<DynamicButton
							onClick={() => window.location.reload()}
							variant="primary">
							Coba Lagi
						</DynamicButton>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="page-transition min-h-screen py-8 bg-gradient-to-br from-slate-50 via-white to-blue-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Header */}
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
					{(organizations || []).map((org) => (
						<article
							key={org.id}
							className="flex flex-col md:flex-row gap-4 p-6 bg-white rounded-xl border shadow-sm">
							<div className="flex-shrink-0 w-full md:w-36 h-36 md:h-36 rounded-lg bg-sky-50 border overflow-hidden flex items-center justify-center">
								{org.logo ? (
									<img
										src={getImageUrl(`organizations/${org.logo}`)}
										alt={`${org.nama} logo`}
										className="object-cover w-full h-full"
										onError={(e) => {
											e.currentTarget.style.display = "none";
										}}
									/>
								) : (
									<div className="text-sky-700 font-bold text-xl">
										{String(org.nama || "")
											.split(" ")
											.map((s) => s[0])
											.slice(0, 2)
											.join("")}
									</div>
								)}
							</div>

							<div className="flex-1 flex flex-col justify-between">
								<div>
									<h3 className="text-xl font-semibold text-sky-900">
										{org.nama}
									</h3>
									{org.kota && (
										<div className="text-sm text-slate-600 mt-1">
											{org.kota}
										</div>
									)}
									{org.deskripsi && (
										<p className="text-sm text-slate-700 mt-3 line-clamp-3">
											{org.deskripsi}
										</p>
									)}
								</div>

								<div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
									<div className="flex items-center gap-3 text-sm text-slate-600">
										{org.rating != null && (
											<span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-sky-50 border text-yellow-500">
												★ {Number(org.rating).toFixed(1)}
											</span>
										)}
										{org.status_verifikasi && (
											<span className="px-2 py-1 rounded bg-green-50 border text-green-700">
												{org.status_verifikasi}
											</span>
										)}
									</div>

									<div className="flex items-center gap-3 flex-wrap text-sm">
										{org.email && (
											<a
												href={`mailto:${org.email}`}
												className="text-sky-700 hover:underline">
												Email
											</a>
										)}
										{org.telepon && (
											<a
												href={`tel:${org.telepon}`}
												className="text-sky-700 hover:underline">
												Telp
											</a>
										)}
										{org.website && (
											<a
												href={
													org.website.startsWith("http")
														? org.website
														: `https://${org.website}`
												}
												target="_blank"
												rel="noreferrer"
												className="text-sky-700 hover:underline">
												Website
											</a>
										)}
									</div>
								</div>
							</div>
						</article>
					))}
				</div>
			</div>
		</div>
	);
}
