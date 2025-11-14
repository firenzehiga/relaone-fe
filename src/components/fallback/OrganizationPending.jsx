import { Link } from "react-router-dom";

export default function OrganizationPending() {
	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-emerald-50 to-white px-4">
			<div className="max-w-xl w-full bg-white shadow-lg rounded-xl p-6 sm:p-8 border border-emerald-100">
				<div className="flex items-start">
					<div className="flex-shrink-0 inline-flex items-center justify-center h-12 w-12 rounded-full bg-emerald-100 text-emerald-600 mr-4">
						<svg
							className="h-6 w-6"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							aria-hidden="true">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M12 8v4l3 3m6 0a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
					</div>
					<div className="flex-1">
						<h2 className="text-lg sm:text-2xl font-semibold text-emerald-800">
							Verifikasi Organisasi Sedang Diproses
						</h2>
						<p className="mt-2 text-sm text-gray-600">
							Terima kasih telah mendaftar sebagai organisasi di RelaOne. Akun
							Anda sedang dalam proses verifikasi oleh tim kami. Kami akan
							mengirimkan email konfirmasi setelah verifikasi selesai.
						</p>

						<ul className="mt-4 space-y-2 text-sm text-gray-700">
							<li className="flex items-start">
								<span className="mr-2 text-emerald-600">•</span>
								Estimasi waktu: 1–3 hari kerja
							</li>
							<li className="flex items-start">
								<span className="mr-2 text-emerald-600">•</span>
								Periksa juga folder spam jika tidak menerima email
							</li>
						</ul>

						<div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3">
							<a
								href="mailto:relaonevolunteer@gmail.com"
								className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm">
								Hubungi Dukungan
							</a>
							<Link
								type="button"
								to="/organization/profile"
								className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md border border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100">
								Lengkapi Profil Organisasi
							</Link>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
