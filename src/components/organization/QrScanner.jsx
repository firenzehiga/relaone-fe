import { useState, useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Scan, CheckCircle, XCircle, AlertCircle, Camera } from "lucide-react";
import { useOrgScanQrMutation } from "../../_hooks/useParticipants";
import Avatar from "../ui/Avatar";
import { getImageUrl } from "@/utils";

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
							handleScan(decodedText, "camera");
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
	const handleScan = async (decodedText, source = "file") => {
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

		// If the scan came from the camera, stop the live scanner temporarily
		if (source === "camera" && scannerRef.current) {
			try {
				await scannerRef.current.stop();
				await scannerRef.current.clear();
				scannerRef.current = null;
			} catch (err) {
				console.error("Error stopping scanner:", err);
			}
			setScanning(false);
		}

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

					// If scan originated from camera, resume camera scanning after a short delay.
					if (source === "camera") {
						setTimeout(() => {
							setResult(null);
							isProcessing.current = false;
							setScanning(true);
						}, 3000);
					} else {
						// For file-based scans, just clear processing state and keep current camera state unchanged.
						setTimeout(() => {
							setResult(null);
							isProcessing.current = false;
						}, 1500);
					}
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

					if (source === "camera") {
						setTimeout(() => {
							setResult(null);
							isProcessing.current = false;
							setScanning(true);
						}, 4000);
					} else {
						setTimeout(() => {
							setResult(null);
							isProcessing.current = false;
						}, 2000);
					}
				},
			}
		);
	};

	// Scan QR code from uploaded file with multiple strategies
	const scanFile = async (file) => {
		if (!file) return;
		if (isProcessing.current) return;

		isProcessing.current = true;
		setResult(null);

		// Helper to attempt scan
		const attemptScan = async (fileToScan) => {
			if (typeof Html5Qrcode.scanFileV2 === "function") {
				const res = await Html5Qrcode.scanFileV2(fileToScan, true);
				return Array.isArray(res) ? res[0] : res;
			} else {
				const tempId = `html5qr-temp-${Date.now()}`;
				let tempEl = document.createElement("div");
				tempEl.id = tempId;
				tempEl.style.display = "none";
				document.body.appendChild(tempEl);

				const tempScanner = new Html5Qrcode(tempId);
				try {
					const res = await tempScanner.scanFile(fileToScan, true);
					const decoded = Array.isArray(res) ? res[0] : res;
					tempScanner.clear();
					if (tempEl.parentNode) tempEl.parentNode.removeChild(tempEl);
					return decoded;
				} catch (err) {
					try {
						tempScanner.clear();
					} catch (e) {}
					if (tempEl.parentNode) tempEl.parentNode.removeChild(tempEl);
					throw err;
				}
			}
		};

		try {
			let decoded = null;
			const strategies = [
				// Strategy 1: Original file as-is
				{ name: "original", process: () => file },
				// Strategy 2: Resize only (no contrast)
				{ name: "resize-only", process: () => preprocessImage(file, 1500, 0) },
				// Strategy 3: Resize + light sharpening
				{ name: "light-sharpen", process: () => preprocessImage(file, 1200, 15) },
				// Strategy 4: Resize + medium contrast
				{ name: "medium-contrast", process: () => preprocessImage(file, 1200, 30) },
				// Strategy 5: Resize + high contrast
				{ name: "high-contrast", process: () => preprocessImage(file, 1000, 50) },
				// Strategy 6: Convert to grayscale + threshold
				{ name: "grayscale", process: () => preprocessGrayscale(file) },
			];

			for (const strategy of strategies) {
				try {
					console.log(`🔍 Trying strategy: ${strategy.name}`);
					const processedFile = await strategy.process();
					const fileToScan =
						processedFile instanceof Blob
							? new File([processedFile], file.name || "scan.png", { type: processedFile.type })
							: processedFile;

					decoded = await attemptScan(fileToScan);

					if (decoded) {
						console.log(`✅ Success with strategy: ${strategy.name}`);
						isProcessing.current = false;
						handleScan(decoded, "file");
						return;
					}
				} catch (err) {
					console.log(`❌ Strategy ${strategy.name} failed:`, err.message);
					// Continue to next strategy
				}
			}

			// All strategies failed
			throw new Error("No MultiFormat Readers were able to detect the code.");
		} catch (err) {
			console.error("❌ All scan strategies failed:", err);
			setResult({
				message: "Gagal memindai file QR Code",
				details:
					"Pastikan gambar QR Code jelas dan tidak blur. Coba foto ulang dengan pencahayaan yang baik.",
			});
			setResultType("error");
			playSound("error");

			setTimeout(() => {
				setResult(null);
				isProcessing.current = false;
			}, 4000);
		}
	};

	// Preprocess image: resize (keep aspect), optionally boost contrast, return Blob
	const preprocessImage = (file, maxDim = 1200, contrast = 0) =>
		new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onerror = () => reject(new Error("Failed to read file"));
			reader.onload = () => {
				const img = new Image();
				img.onload = () => {
					let { width, height } = img;
					const ratio = width / height;
					if (Math.max(width, height) > maxDim) {
						if (width >= height) {
							width = maxDim;
							height = Math.round(maxDim / ratio);
						} else {
							height = maxDim;
							width = Math.round(maxDim * ratio);
						}
					}
					const canvas = document.createElement("canvas");
					canvas.width = width;
					canvas.height = height;
					const ctx = canvas.getContext("2d");
					ctx.fillStyle = "#ffffff";
					ctx.fillRect(0, 0, width, height);
					ctx.drawImage(img, 0, 0, width, height);

					// Apply contrast adjustment if specified
					if (contrast !== 0) {
						try {
							const imgData = ctx.getImageData(0, 0, width, height);
							const d = imgData.data;
							const f = (259 * (contrast + 255)) / (255 * (259 - contrast));
							for (let i = 0; i < d.length; i += 4) {
								d[i] = Math.min(255, Math.max(0, f * (d[i] - 128) + 128));
								d[i + 1] = Math.min(255, Math.max(0, f * (d[i + 1] - 128) + 128));
								d[i + 2] = Math.min(255, Math.max(0, f * (d[i + 2] - 128) + 128));
							}
							ctx.putImageData(imgData, 0, 0);
						} catch (e) {
							console.warn("preprocess contrast failed", e);
						}
					}

					canvas.toBlob(
						(blob) => {
							if (blob) resolve(blob);
							else reject(new Error("Canvas toBlob failed"));
						},
						"image/png",
						0.95
					);
				};
				img.onerror = () => reject(new Error("Image load error"));
				img.src = String(reader.result);
			};
			reader.readAsDataURL(file);
		});

	// Preprocess to grayscale with adaptive threshold for better QR detection
	const preprocessGrayscale = (file) =>
		new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onerror = () => reject(new Error("Failed to read file"));
			reader.onload = () => {
				const img = new Image();
				img.onload = () => {
					let { width, height } = img;
					const ratio = width / height;
					// Target size for grayscale processing
					const maxDim = 1200;
					if (Math.max(width, height) > maxDim) {
						if (width >= height) {
							width = maxDim;
							height = Math.round(maxDim / ratio);
						} else {
							height = maxDim;
							width = Math.round(maxDim * ratio);
						}
					}

					const canvas = document.createElement("canvas");
					canvas.width = width;
					canvas.height = height;
					const ctx = canvas.getContext("2d");
					ctx.fillStyle = "#ffffff";
					ctx.fillRect(0, 0, width, height);
					ctx.drawImage(img, 0, 0, width, height);

					try {
						const imgData = ctx.getImageData(0, 0, width, height);
						const d = imgData.data;

						// Convert to grayscale and apply threshold
						for (let i = 0; i < d.length; i += 4) {
							const gray = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
							// Adaptive threshold - makes QR codes sharper
							const val = gray > 127 ? 255 : 0;
							d[i] = d[i + 1] = d[i + 2] = val;
						}
						ctx.putImageData(imgData, 0, 0);
					} catch (e) {
						console.warn("grayscale processing failed", e);
					}

					canvas.toBlob(
						(blob) => {
							if (blob) resolve(blob);
							else reject(new Error("Canvas toBlob failed"));
						},
						"image/png",
						1.0
					);
				};
				img.onerror = () => reject(new Error("Failed to load image"));
				img.src = reader.result;
			};
			reader.readAsDataURL(file);
		});

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
		<div
			className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6"
			onDragOver={(e) => e.preventDefault()}
			onDrop={(e) => {
				e.preventDefault();
				const f = e.dataTransfer?.files?.[0];
				if (f) scanFile(f);
			}}>
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
									<Avatar
										src={getImageUrl(`foto_profil/${result.volunteer?.foto}`)}
										fallback={result.volunteer?.nama}
										size="md"
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
