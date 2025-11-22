import { useState, useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Scan, CheckCircle, XCircle, AlertCircle, Camera } from "lucide-react";
import { useOrgScanQrMutation } from "../../_hooks/useParticipants";

/**
 * Component QR Scanner untuk organization check-in volunteer
 * Scan QR Code volunteer untuk update status menjadi 'attended'
 */
function QrScanner({ eventId }) {
	const scanQrMutation = useOrgScanQrMutation();
	const [scanning, setScanning] = useState(false);
	const [result, setResult] = useState(null);
	const [resultType, setResultType] = useState(""); // 'success' | 'error' | 'warning'
	const scannerRef = useRef(null);
	// Ref merupakan penanda apakah sedang memproses scan
	const isProcessing = useRef(false);
	// Ref untuk menandai apakah scanner sedang berhenti
	const isStopping = useRef(false);
	// Ref untuk input file (upload QR)
	const fileInputRef = useRef(null);

	useEffect(() => {
		let mounted = true;

		// Inisialisasi scanner saat scanning diaktifkan
		if (scanning && !scannerRef.current) {
			console.log("🎥 Initializing scanner...");

			const initScanner = async () => {
				try {
					const scannerElement = document.getElementById("qr-reader");
					if (!scannerElement) {
						console.error("❌ Scanner element not found!");
						return;
					}

					console.log("✅ Scanner element found, creating scanner instance...");

					const html5QrCode = new Html5Qrcode("qr-reader");

					const handleCameraDetected = (decodedText) => {
						if (mounted && !isProcessing.current) {
							handleScan(decodedText);
						}
					};

					const handleCameraError = (error) => {
						// Ignore common scanning errors
						if (!error.includes("NotFoundException")) {
							console.warn("⚠️ Scan error:", error);
						}
					};

					// Mulai kamera dengan konfigurasi - area pemindaian lebih besar
					await html5QrCode.start(
						{ facingMode: "environment" }, // Gunakan kamera belakang
						{
							fps: 15, // FPS ditingkatkan untuk deteksi lebih baik
							qrbox: { width: 350, height: 350 }, // Area pemindaian lebih besar
							aspectRatio: 1.0,
						},
						handleCameraDetected,
						handleCameraError
					);

					scannerRef.current = html5QrCode;
				} catch (error) {
					console.error("❌ Failed to initialize scanner:", error);
					alert("Gagal mengakses kamera. Pastikan Anda sudah memberikan izin akses kamera.");
					if (mounted) setScanning(false);
				}
			};

			// Small delay to ensure DOM is ready
			setTimeout(() => {
				initScanner();
			}, 100);
		}

		// Bersihkan scanner saat komponen di-unmount atau scanning dimatikan
		return () => {
			mounted = false;
			if (scannerRef.current && !isStopping.current) {
				const scanner = scannerRef.current;
				scannerRef.current = null;

				// Bersihkan tanpa blocking
				scanner
					.stop()
					.then(() => scanner.clear())
					.then(() => console.log("✅ Scanner cleanup complete"))
					.catch((error) => {
						console.warn("⚠️ Scanner cleanup error (can ignore):", error);
					});
			}
		};
	}, [scanning]);
	const handleScan = async (decodedText) => {
		if (!decodedText || isProcessing.current) return;

		// Set processing flag segera untuk menghindari penanganan ganda
		isProcessing.current = true;

		// Kasih tampilan proses
		setResult({ message: "Memproses QR Code..." });
		setResultType("warning");
		playSound("processing");

		// TUNGGU SEBENTAR supaya UI "Memproses..." terasa sebelum lanjut
		await new Promise((res) => setTimeout(res, 4000));

		// Jika selama delay proses dibatalkan (mis. user stop), hentikan
		if (!isProcessing.current) return;

		// Hentikan scanner sementara (kami masih menampilkan UI proses saat menunggu berhenti)
		if (scannerRef.current) {
			try {
				await scannerRef.current.stop();
				await scannerRef.current.clear();
				scannerRef.current = null;
			} catch (err) {
				console.error("Error stopping scanner:", err);
			}
		}
		setScanning(false);

		// Panggil mutation untuk check-in volunteer
		scanQrMutation.mutate(
			{
				eventId,
				qr_data: decodedText,
			},
			{
				onSuccess: (response) => {
					setResult({
						message: response.message,
						volunteer: response.data.volunteer_info,
						event: response.data.event_info,
					});
					setResultType("success");

					// Play success sound (optional)
					playSound("success");

					// Tidak perlu memanggil callback ke parent lagi;
					// invalidation/refetch sudah ditangani oleh hook `useOrgScanQrMutation`.
					// (Jika suatu saat ingin behavior custom, gunakan props ini dari parent.)

					// Auto clear dan scan lagi setelah 3 detik
					setTimeout(() => {
						setResult(null);
						isProcessing.current = false;
						setScanning(true);
					}, 3000);
				},
				onError: (error) => {
					const errorData = error.response?.data;

					setResult({
						message: errorData?.message || "Gagal memproses QR Code",
						volunteer: errorData?.volunteer_info,
						details: errorData?.current_status,
					});
					setResultType("error");

					// Play error sound (optional)
					playSound("error");

					// Tidak memanggil callback error ke parent karena invalidation
					// dan notifikasi sudah ditangani di hook.

					// Auto clear dan scan lagi setelah 4 detik
					setTimeout(() => {
						setResult(null);
						isProcessing.current = false;
						setScanning(true);
					}, 4000);
				},
			}
		);
	};

	// Scan QR code from an uploaded file (image). Uses Html5Qrcode.scanFileV2 when available,
	// otherwise falls back to creating a temporary Html5Qrcode instance and using scanFile.
	const scanFile = async (file) => {
		if (!file) return;
		if (isProcessing.current) return;

		// mark as processing to prevent duplicates
		isProcessing.current = true;
		setResult(null);

		try {
			// Prefer the static/newer API if available
			if (typeof Html5Qrcode.scanFileV2 === "function") {
				const res = await Html5Qrcode.scanFileV2(file, true);
				// scanFileV2 may return a string or an array
				const decoded = Array.isArray(res) ? res[0] : res;
				// Ensure we call the same handling pipeline
				isProcessing.current = false; // allow handleScan to set flag
				handleScan(decoded);
				return;
			}

			// Fallback: create a temporary, hidden element and instance to scan the file
			const tempId = "html5qr-temp-file-scan";
			let tempEl = document.getElementById(tempId);
			if (!tempEl) {
				tempEl = document.createElement("div");
				tempEl.id = tempId;
				tempEl.style.display = "none";
				document.body.appendChild(tempEl);
			}

			const tempScanner = new Html5Qrcode(tempId);
			try {
				const res = await tempScanner.scanFile(file, true);
				const decoded = Array.isArray(res) ? res[0] : res;
				tempScanner.clear();
				if (tempEl && tempEl.parentNode) tempEl.parentNode.removeChild(tempEl);
				isProcessing.current = false; // allow handleScan to set flag
				handleScan(decoded);
				return;
			} catch (err) {
				// cleanup then rethrow to outer catcher
				try {
					tempScanner.clear();
				} catch (e) {}
				if (tempEl && tempEl.parentNode) tempEl.parentNode.removeChild(tempEl);
				throw err;
			}
		} catch (err) {
			console.error("❌ File scan error:", err);
			setResult({
				message: "Gagal memindai file QR Code",
				details: err?.message || String(err),
			});
			setResultType("error");
			playSound("error");

			setTimeout(() => {
				setResult(null);
				isProcessing.current = false;
			}, 3000);
		}
	};

	const handleFileChange = (e) => {
		const file = e.target.files?.[0];
		if (file) scanFile(file);
		// clear input so same file can be reselected later
		e.target.value = null;
	};

	const playSound = (type) => {
		try {
			const audio = new Audio(`/sounds/${type}.mp3`);
			audio.play().catch((err) => console.log("Sound play failed:", err));
		} catch (err) {
			console.log("Sound not available");
		}
	};

	const startScanning = () => {
		if (isStopping.current) {
			console.log("⚠️ Scanner is stopping, please wait...");
			return;
		}
		setScanning(true);
		setResult(null);
		isProcessing.current = false;
	};

	const stopScanning = async () => {
		if (isStopping.current) {
			console.log("⚠️ Already stopping...");
			return;
		}

		isStopping.current = true;
		console.log("🛑 Stopping scanner...");

		try {
			if (scannerRef.current) {
				const scanner = scannerRef.current;
				scannerRef.current = null; // Clear ref immediately to prevent double stop

				// Check if scanner is running before stopping
				if (scanner.getState && scanner.getState() === 2) {
					// State 2 = SCANNING
					await scanner.stop();
					console.log("✅ Scanner stopped");
				}

				await scanner.clear();
				console.log("✅ Scanner cleared");
			}

			setScanning(false);
			isProcessing.current = false;
		} catch (error) {
			console.error("❌ Error stopping scanner:", error);
			// Force cleanup even on error
			scannerRef.current = null;
			setScanning(false);
			isProcessing.current = false;
		} finally {
			isStopping.current = false;
		}
	};

	return (
		<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
			<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-4">
				<h2 className="text-lg sm:text-xl font-semibold text-gray-800 flex items-center gap-2">
					<Scan className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
					Scanner Check-in
				</h2>

				{!scanning ? (
					<button
						onClick={startScanning}
						className="w-full sm:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center gap-2 transition-colors text-sm">
						<Camera className="w-4 h-4" />
						Mulai Scan
					</button>
				) : (
					<button
						onClick={stopScanning}
						className="w-full sm:w-auto px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm">
						Stop Scan
					</button>
				)}
			</div>
			{/* Scanner Area */}
			{scanning && !result && (
				<div className="mb-4">
					<div
						id="qr-reader"
						onDragOver={(e) => e.preventDefault()}
						onDrop={(e) => {
							e.preventDefault();
							const f = e.dataTransfer?.files?.[0];
							if (f) scanFile(f);
						}}
						style={{
							width: "100%",
							minHeight: "350px",
							border: "2px solid #3b82f6",
							borderRadius: "8px",
							overflow: "hidden",
							backgroundColor: "#000",
						}}
					/>
					<p className="text-center text-xs sm:text-sm text-gray-600 mt-3">
						📹 Arahkan kamera ke QR Code volunteer
					</p>
					<p className="text-center text-xs sm:text-sm text-gray-500 mt-1">
						atau seret gambar QR ke area kamera untuk memindai dari file
					</p>
					<p className="text-center text-xs text-gray-500 mt-1">
						Pastikan QR Code terlihat jelas dalam kotak hijau. Area scanning sudah diperbesar untuk
						pembacaan lebih mudah.
					</p>
				</div>
			)}{" "}
			{/* Result Display */}
			{result && (
				<div
					className={`rounded-lg p-3 sm:p-4 mb-4 border-2 ${
						resultType === "success"
							? "bg-green-50 border-green-300"
							: resultType === "error"
							? "bg-red-50 border-red-300"
							: "bg-yellow-50 border-yellow-300"
					}`}>
					<div className="flex items-start gap-2 sm:gap-3">
						{resultType === "success" ? (
							<CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 flex-shrink-0" />
						) : resultType === "error" ? (
							<XCircle className="w-6 h-6 sm:w-8 sm:h-8 text-red-600 flex-shrink-0" />
						) : (
							<AlertCircle className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-600 flex-shrink-0" />
						)}

						<div className="flex-1 min-w-0">
							<h3
								className={`font-semibold text-base sm:text-lg mb-2 ${
									resultType === "success"
										? "text-green-800"
										: resultType === "error"
										? "text-red-800"
										: "text-yellow-800"
								}`}>
								{result.message}
							</h3>

							{result.volunteer && (
								<div className="flex items-center gap-2 sm:gap-3 bg-white rounded-lg p-2 sm:p-3 mt-2">
									<img
										src={result.volunteer.foto || "/images/logo_be.png"}
										alt={result.volunteer.nama}
										className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-gray-200 flex-shrink-0"
									/>
									<div className="flex-1 min-w-0">
										<p className="font-medium text-gray-800 text-sm sm:text-base truncate">
											{result.volunteer.nama}
										</p>
										<p className="text-xs sm:text-sm text-gray-600 truncate">
											{result.volunteer.email}
										</p>
										{result.volunteer.tanggal_hadir && (
											<p className="text-xs text-green-600 mt-1">
												✓ Check-in: {result.volunteer.tanggal_hadir}
											</p>
										)}
									</div>
								</div>
							)}

							{result.details && (
								<div className="mt-2 text-xs sm:text-sm text-gray-700 bg-white rounded p-2">
									<p>
										Status: <span className="font-medium">{result.details}</span>
									</p>
								</div>
							)}
						</div>
					</div>
				</div>
			)}
			{/* Info Box */}
			{!scanning && !result && (
				<div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 text-center">
					<Camera className="w-10 h-10 sm:w-12 sm:h-12 text-blue-500 mx-auto mb-2" />
					<p className="text-blue-800 font-medium text-sm sm:text-base">Scanner belum aktif</p>
					<p className="text-blue-600 text-xs sm:text-sm mt-1">
						Klik "Mulai Scan" untuk memulai check-in volunteer
					</p>
					<p className="text-sm text-gray-700 mt-3">atau unggah gambar QR:</p>
					<button
						onClick={() => fileInputRef.current?.click()}
						className="mt-2 inline-flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50">
						Upload QR Image
					</button>
				</div>
			)}
			{/* Hidden file input used by upload buttons */}
			<input
				type="file"
				accept="image/*"
				ref={fileInputRef}
				onChange={handleFileChange}
				style={{ display: "none" }}
			/>
		</div>
	);
}

export default QrScanner;
