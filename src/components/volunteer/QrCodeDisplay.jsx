import { useState, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
import {
	Download,
	QrCode as QrCodeIcon,
	CheckCircle,
	Loader2,
	AlertCircle,
} from "lucide-react";
import DynamicButton from "../ui/Button";
import { useVolunteerGenerateQrCodeMutation } from "@/_hooks/useParticipants";
import FetchLoader from "../ui/FetchLoader";

/**
 * Component untuk menampilkan QR Code volunteer
 * Menggunakan encrypted QR data dari backend untuk keamanan
 * QR Code berisi user_id yang di-encrypt dengan token verification
 *
 * @param {string} participationId - ID partisipasi event dari backend (untuk display info)
 * @param {Object} eventData - Data event (optional untuk display info)
 */
function QrCodeDisplay({ participationId, eventData }) {
	const [downloaded, setDownloaded] = useState(false);
	const [qrCodeData, setQrCodeData] = useState(null);
	const [showQR, setShowQR] = useState(false);

	// Mutation untuk generate QR Code
	const {
		mutate: generateQR,
		isPending,
		error,
	} = useVolunteerGenerateQrCodeMutation();

	// QR Code value adalah encrypted data dari backend
	const qrData = qrCodeData?.qr_data;

	// Handler untuk generate dan tampilkan QR Code
	const handleShowQR = () => {
		if (!qrCodeData) {
			generateQR(undefined, {
				onSuccess: (response) => {
					setQrCodeData(response);
					setShowQR(true);
				},
			});
		} else {
			setShowQR(true);
		}
	};

	const handleDownload = () => {
		const canvas = document.getElementById("volunteer-qr-canvas");
		if (!canvas) return;

		const pngUrl = canvas
			.toDataURL("image/png")
			.replace("image/png", "image/octet-stream");

		const link = document.createElement("a");
		link.href = pngUrl;
		link.download = `volunteer-qr-${
			qrCodeData?.user?.nama || "volunteer"
		}-${Date.now()}.png`;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);

		setDownloaded(true);
		setTimeout(() => setDownloaded(false), 3000);
	};

	// Jika belum generate/tampilkan QR - tampilkan tombol untuk generate
	if (!showQR && !qrCodeData) {
		return (
			<div className="bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-xl p-8 text-center shadow-sm">
				<QrCodeIcon className="w-20 h-20 text-emerald-600 mx-auto mb-4" />
				<h3 className="text-xl font-bold text-gray-900 mb-2">
					QR Code Check-in
				</h3>
				<p className="text-gray-700 mb-6 max-w-md mx-auto">
					Klik tombol di bawah untuk menampilkan dan mengunduh QR Code kehadiran
					Anda
				</p>
				<DynamicButton
					variant="success"
					size="lg"
					onClick={handleShowQR}
					disabled={isPending}
					className="flex items-center justify-center gap-2 mx-auto shadow-md hover:shadow-lg">
					{isPending ? (
						<>
							<Loader2 className="w-5 h-5 animate-spin" />
							<span className="font-semibold">Membuat QR Code...</span>
						</>
					) : (
						<>
							<QrCodeIcon className="w-5 h-5" />
							<span className="font-semibold">Tampilkan QR Code</span>
						</>
					)}
				</DynamicButton>

				{/* Instruksi di bawah tombol */}
				<div className="mt-6 bg-white border-2 border-emerald-200 rounded-xl p-4">
					<p className="text-sm text-emerald-900 font-bold mb-3 flex items-center justify-center gap-2">
						<CheckCircle className="w-4 h-4" />
						Cara Menggunakan QR Code
					</p>
					<ul className="text-xs text-emerald-800 space-y-2 text-left max-w-md mx-auto">
						<li className="flex items-start gap-2">
							<span className="font-bold text-emerald-600 flex-shrink-0">
								1.
							</span>
							<span>Download dan simpan QR Code di HP Anda</span>
						</li>
						<li className="flex items-start gap-2">
							<span className="font-bold text-emerald-600 flex-shrink-0">
								2.
							</span>
							<span>Bawa saat hari H event (screenshot atau print)</span>
						</li>
						<li className="flex items-start gap-2">
							<span className="font-bold text-emerald-600 flex-shrink-0">
								3.
							</span>
							<span>Tunjukkan ke petugas organizer untuk di-scan</span>
						</li>
						<li className="flex items-start gap-2">
							<span className="font-bold text-emerald-600 flex-shrink-0">
								4.
							</span>
							<span>Kehadiran Anda akan tercatat secara otomatis! ✅</span>
						</li>
					</ul>
				</div>
			</div>
		);
	}

	// Error state
	if (error) {
		return (
			<div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 text-center shadow-sm">
				<AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
				<p className="text-red-800 font-semibold mb-2">Gagal Membuat QR Code</p>
				<p className="text-red-600 text-sm mb-4">
					{error?.message || "Terjadi kesalahan saat membuat QR Code"}
				</p>
				<DynamicButton variant="danger" size="sm" onClick={handleShowQR}>
					Coba Lagi
				</DynamicButton>
			</div>
		);
	}

	// Loading state saat generate
	if (isPending) {
		return (
			<div className="bg-white border border-gray-200 rounded-xl p-8 text-center shadow-sm">
				<FetchLoader />
				<p className="text-gray-600 mt-4 font-medium">Membuat QR Code...</p>
			</div>
		);
	}

	// Jika belum ada QR data tapi showQR true
	if (!qrData) {
		return (
			<div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-6 text-center shadow-sm">
				<QrCodeIcon className="w-16 h-16 text-amber-500 mx-auto mb-4" />
				<p className="text-amber-800 font-semibold mb-2">
					QR Code Belum Tersedia
				</p>
				<p className="text-amber-600 text-sm mb-4">
					Silakan klik tombol di bawah untuk generate QR Code
				</p>
				<DynamicButton variant="primary" size="sm" onClick={handleShowQR}>
					Generate QR Code
				</DynamicButton>
			</div>
		);
	}

	return (
		<div className="bg-white rounded-xl shadow-sm">
			{/* QR Code Display */}
			<div className="bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-xl p-8 mb-6">
				<div className="flex justify-center mb-6">
					<div className="bg-white p-5 rounded-2xl shadow-lg border-4 border-white">
						<QRCodeCanvas
							id="volunteer-qr-canvas"
							value={qrData}
							size={256}
							level="H"
							includeMargin={true}
						/>
					</div>
				</div>

				<div className="text-center space-y-2">
					{qrCodeData?.user && (
						<>
							<div className="flex items-center justify-center gap-2 mb-3">
								<CheckCircle className="w-5 h-5 text-emerald-600" />
								<p className="text-lg font-bold text-gray-900">
									{qrCodeData.user.nama}
								</p>
							</div>
							<p className="text-sm text-gray-600">{qrCodeData.user.email}</p>
						</>
					)}
					{eventData?.judul && (
						<div className="mt-4 pt-4 border-t border-emerald-200">
							<p className="text-xs text-gray-500 mb-1">Event</p>
							<p className="text-sm font-semibold text-gray-800">
								{eventData.judul}
							</p>
						</div>
					)}
					{participationId && (
						<p className="text-xs text-gray-500 mt-3">
							Participation ID: #{participationId}
						</p>
					)}
				</div>
			</div>

			{/* Info & Action */}
			<div className="space-y-4 px-2">
				<DynamicButton
					variant="success"
					size="lg"
					onClick={handleDownload}
					className="w-full flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all">
					{downloaded ? (
						<>
							<CheckCircle className="w-5 h-5" />
							<span className="font-semibold">QR Code Tersimpan!</span>
						</>
					) : (
						<>
							<Download className="w-5 h-5" />
							<span className="font-semibold">Download QR Code</span>
						</>
					)}
				</DynamicButton>

				{qrCodeData?.info && (
					<div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
						<p className="text-sm text-blue-900 font-medium mb-3 flex items-center gap-2">
							<QrCodeIcon className="w-4 h-4" />
							Informasi Penting
						</p>
						<p className="text-xs text-blue-800 leading-relaxed mb-3">
							{qrCodeData.info}
						</p>
					</div>
				)}

				<div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-xl p-4">
					<p className="text-sm text-emerald-900 font-bold mb-3 flex items-center gap-2">
						<CheckCircle className="w-4 h-4" />
						Cara Menggunakan QR Code
					</p>
					<ul className="text-xs text-emerald-800 space-y-2">
						<li className="flex items-start gap-2">
							<span className="font-bold text-emerald-600 flex-shrink-0">
								1.
							</span>
							<span>Download dan simpan QR Code ini di HP Anda</span>
						</li>
						<li className="flex items-start gap-2">
							<span className="font-bold text-emerald-600 flex-shrink-0">
								2.
							</span>
							<span>Bawa saat hari H event (screenshot atau print)</span>
						</li>
						<li className="flex items-start gap-2">
							<span className="font-bold text-emerald-600 flex-shrink-0">
								3.
							</span>
							<span>Tunjukkan ke petugas organizer untuk di-scan</span>
						</li>
						<li className="flex items-start gap-2">
							<span className="font-bold text-emerald-600 flex-shrink-0">
								4.
							</span>
							<span>Kehadiran Anda akan tercatat secara otomatis! ✅</span>
						</li>
					</ul>
				</div>

				<div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4">
					<p className="text-xs text-amber-800 leading-relaxed">
						<strong>⚠️ Catatan:</strong> QR Code ini adalah ID volunteer Anda
						yang unik dan terenkripsi. Jangan bagikan ke orang lain untuk
						mencegah penyalahgunaan.
					</p>
				</div>
			</div>
		</div>
	);
}

export default QrCodeDisplay;
