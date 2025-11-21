import { CircleX, ClipboardClock, Mail, Phone } from "lucide-react";
import { Link } from "react-router-dom";

export default function OrganizationPending({ status_verifikasi }) {
	const isRejected = status_verifikasi === "rejected";
	const isPending = status_verifikasi === "pending";

	if (!isPending && !isRejected) return null;

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-emerald-50 to-white px-4">
			<div className="max-w-2xl w-full bg-white shadow-lg rounded-xl p-6 sm:p-8 border border-emerald-100">
				<div className="flex items-start gap-4">
					<div
						className={`flex-shrink-0 inline-flex items-center justify-center h-14 w-14 rounded-full mr-2 ${
							isPending ? "bg-emerald-100 text-emerald-600" : "bg-red-100 text-red-600"
						}`}>
						{isPending ? <ClipboardClock className="w-7 h-7" /> : <CircleX className="w-7 h-7" />}
					</div>

					<div className="flex-1">
						<h2
							className={`text-lg sm:text-2xl font-semibold ${
								isPending ? "text-emerald-800" : "text-red-600"
							}`}>
							{isPending
								? "Permintaan Verifikasi Sedang Diproses"
								: "Verifikasi Organisasi Ditolak"}
						</h2>

						<p className="mt-2 text-sm text-gray-600">
							{isPending
								? "Terima kasih sudah mendaftar sebagai organisasi di RelaOne. Tim kami sedang meninjau dokumen dan informasi Anda. Biasanya proses ini memakan waktu 1–3 hari kerja."
								: "Sayangnya, verifikasi organisasi Anda ditolak. Silakan periksa kembali informasi atau dokumen yang dikirim, lalu ajukan kembali atau hubungi tim dukungan untuk bantuan."}
						</p>

						<div className="mt-4 text-sm text-gray-700">
							<h4 className="font-medium mb-2">
								{isPending
									? "Hal selanjutnya yang akan dilakukan:"
									: "Hal ini mungkin terjadi karena:"}
							</h4>
							<ul className="space-y-2 list-none">
								{isPending ? (
									<>
										<li className="flex items-start">
											<span className="mr-3 text-emerald-600 mt-1">•</span>
											<span>
												Pihak kami akan menghubungi Anda melalui email maupun nomor yang Anda
												daftarkan untuk melakukan verifikasi lebih lanjut.
											</span>
										</li>
										<li className="flex items-start">
											<span className="mr-3 text-emerald-600 mt-1">•</span>
											<span>
												Cek email atau nomor Anda untuk notifikasi untuk proses verifikasi
												organisasi.
											</span>
										</li>
										<li className="flex items-start">
											<span className="mr-3 text-emerald-600 mt-1">•</span>
											<span>Periksa juga folder spam jika tidak menerima email.</span>
										</li>
									</>
								) : (
									<>
										<li className="flex items-start">
											<span className="mr-3 text-red-600 mt-1">•</span>
											<span>
												Tidak membalas email atau informasi kelanjutan verifikasi yang dikirim oleh
												tim kami.
											</span>
										</li>
										<li className="flex items-start">
											<span className="mr-3 text-red-600 mt-1">•</span>
											<span>Informasi yang diberikan tidak lengkap atau kurang mendukung.</span>
										</li>
									</>
								)}
							</ul>
						</div>
						<div className="text-sm mt-5 font-medium text-gray-700">Hubungi Kami</div>

						<div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
							<div className="flex flex-wrap gap-3">
								<a
									href="https://wa.me/6285894310722"
									target="_blank"
									rel="noreferrer"
									aria-label="Chat via WhatsApp"
									className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm">
									<Phone className="w-4 h-4 mr-2" />
									Whatsapp
								</a>

								<a
									href="mailto:relaonevolunteer@gmail.com"
									aria-label="Send email"
									className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md bg-amber-600 text-white hover:bg-amber-700 shadow-sm">
									<Mail className="w-4 h-4 mr-2" />
									Email
								</a>

								{isPending && (
									<Link
										type="button"
										to="/organization/profile"
										className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md border border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100">
										Lengkapi Profil Organisasi
									</Link>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
