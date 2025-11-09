import { useState, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Download, QrCode as QrCodeIcon, CheckCircle } from "lucide-react";
import Button from "../ui/Button";

/**
 * Component untuk menampilkan QR Code volunteer
 * Digunakan setelah volunteer dikonfirmasi oleh organization
 */
function QrCodeDisplay({ participantData }) {
	const [qrData, setQrData] = useState("");
	const [downloaded, setDownloaded] = useState(false);

	useEffect(() => {
		// QR data dari backend setelah konfirmasi
		if (participantData?.qr_code) {
			setQrData(participantData.qr_code);
		}
	}, [participantData]);

	const handleDownload = () => {
		const canvas = document.getElementById("volunteer-qr-canvas");
		if (!canvas) return;

		const pngUrl = canvas
			.toDataURL("image/png")
			.replace("image/png", "image/octet-stream");

		const link = document.createElement("a");
		link.href = pngUrl;
		link.download = `qr-code-${participantData?.event?.judul || "event"}.png`;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);

		setDownloaded(true);
		setTimeout(() => setDownloaded(false), 3000);
	};

	if (!qrData) {
		return (
			<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
				<QrCodeIcon className="w-12 h-12 text-yellow-500 mx-auto mb-2" />
				<p className="text-yellow-800 font-medium">QR Code belum tersedia</p>
				<p className="text-yellow-600 text-sm mt-1">
					QR Code akan otomatis muncul setelah pendaftaran Anda dikonfirmasi
					oleh organisasi
				</p>
			</div>
		);
	}

	return (
		<div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
			<div className="flex items-center justify-between mb-4">
				<h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
					<CheckCircle className="w-5 h-5 text-green-500" />
					QR Code Check-in Anda
				</h3>
			</div>

			<div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-indigo-200 rounded-xl p-6 mb-4">
				<div className="flex justify-center mb-4">
					<div className="bg-white p-4 rounded-lg shadow-md">
						<QRCodeCanvas
							id="volunteer-qr-canvas"
							value={qrData}
							size={220}
							level="H"
							includeMargin={true}
						/>
					</div>
				</div>

				<div className="text-center">
					<p className="text-sm text-gray-600 mb-1">
						{participantData?.event?.judul}
					</p>
					<p className="text-xs text-gray-500">
						{participantData?.volunteer?.nama}
					</p>
				</div>
			</div>

			<div className="space-y-3">
				<Button
					onClick={handleDownload}
					className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700">
					{downloaded ? (
						<>
							<CheckCircle className="w-4 h-4" />
							QR Code Tersimpan!
						</>
					) : (
						<>
							<Download className="w-4 h-4" />
							Download QR Code
						</>
					)}
				</Button>

				<div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
					<p className="text-xs text-blue-800 font-medium mb-1">
						📱 Cara Menggunakan:
					</p>
					<ul className="text-xs text-blue-700 space-y-1 list-disc list-inside">
						<li>Download dan simpan QR Code ini</li>
						<li>Bawa saat hari H event (bisa di HP atau print)</li>
						<li>Tunjukkan ke petugas untuk di-scan</li>
						<li>Selesai! Kehadiran Anda akan tercatat</li>
					</ul>
				</div>
			</div>
		</div>
	);
}

export default QrCodeDisplay;
