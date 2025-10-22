import { useOrganizations } from "@/hooks/useOrganizations";

export default function OrganizationsPage() {
	const {
		data: organizations,
		isLoading,
		error,
	} = useOrganizations({ status_verifikasi: "verified" });

	if (isLoading) {
		return (
			<div className="max-w-6xl mx-auto px-4 py-8">
				<h1 className="text-2xl font-semibold text-sky-800 mb-6">
					Organizations
				</h1>
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
		);
	}

	if (error) {
		return (
			<div className="max-w-4xl mx-auto px-4 py-8">
				<div
					role="alert"
					className="p-6 bg-red-50 border border-red-200 rounded-lg shadow-sm">
					<h2 className="text-red-700 text-lg font-semibold mb-2">
						Gagal memuat organisasi
					</h2>
					<p className="text-sm text-red-600 mb-4">
						Coba muat ulang halaman atau periksa koneksi.
					</p>
					<button
						onClick={() => window.location.reload()}
						className="inline-flex items-center gap-2 px-4 py-2 bg-sky-700 text-white rounded-md hover:bg-sky-600">
						Muat Ulang
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="max-w-6xl mx-auto px-4 py-8">
			<h1 className="text-2xl font-semibold text-sky-800 mb-6">
				Organizations
			</h1>

			<div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
				{(organizations || []).map((org) => (
					<article
						key={org.id}
						className="flex flex-col md:flex-row gap-4 p-6 bg-white rounded-xl border shadow-sm">
						<div className="flex-shrink-0 w-full md:w-36 h-36 md:h-36 rounded-lg bg-sky-50 border overflow-hidden flex items-center justify-center">
							{org.logo ? (
								// if logo is a url
								<img
									src={org.logo}
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
									<div className="text-sm text-slate-600 mt-1">{org.kota}</div>
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
	);
}
