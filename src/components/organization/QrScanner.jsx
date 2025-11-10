import { useState, useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Scan, CheckCircle, XCircle, AlertCircle, Camera } from "lucide-react";
import { useOrgScanQrMutation } from "../../_hooks/useParticipants";

/**
 * Component QR Scanner untuk organization check-in volunteer
 * Scan QR Code volunteer untuk update status menjadi 'attended'
 */
function QrScanner({ eventId, onScanSuccess, onScanError }) {
	const scanQrMutation = useOrgScanQrMutation();
	const [scanning, setScanning] = useState(false);
	const [result, setResult] = useState(null);
	const [resultType, setResultType] = useState(""); // 'success' | 'error' | 'warning'
	const scannerRef = useRef(null);
	const isProcessing = useRef(false);
	const isStopping = useRef(false);

	useEffect(() => {
		let mounted = true;

		// Initialize scanner when scanning is true
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

					const onScanSuccess = (decodedText) => {
						console.log("✅ QR Detected:", decodedText);
						if (mounted && !isProcessing.current) {
							handleScan(decodedText);
						}
					};

					const onScanFailure = (error) => {
						// Ignore common scanning errors
						if (!error.includes("NotFoundException")) {
							console.warn("⚠️ Scan error:", error);
						}
					};

					console.log("📹 Starting camera...");

					// Start camera with config - larger scanning area
					await html5QrCode.start(
						{ facingMode: "environment" }, // Use back camera
						{
							fps: 15, // Increased FPS for better detection
							qrbox: { width: 350, height: 350 }, // Larger scanning area
							aspectRatio: 1.0,
						},
						onScanSuccess,
						onScanFailure
					);

					scannerRef.current = html5QrCode;
					console.log("✅ Scanner initialized successfully!");
				} catch (error) {
					console.error("❌ Failed to initialize scanner:", error);
					alert(
						"Gagal mengakses kamera. Pastikan Anda sudah memberikan izin akses kamera."
					);
					if (mounted) setScanning(false);
				}
			};

			// Small delay to ensure DOM is ready
			setTimeout(() => {
				initScanner();
			}, 100);
		}

		// Cleanup
		return () => {
			mounted = false;
			if (scannerRef.current && !isStopping.current) {
				const scanner = scannerRef.current;
				scannerRef.current = null;

				// Cleanup without blocking
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

		// Set processing flag
		isProcessing.current = true;

		// Stop scanner temporarily
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

		// Call mutation to check-in volunteer
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

					// Callback to parent
					if (onScanSuccess) {
						onScanSuccess(response.data);
					}

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

					// Callback to parent
					if (onScanError) {
						onScanError(errorData);
					}

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
					<p className="text-center text-xs text-gray-500 mt-1">
						Pastikan QR Code terlihat jelas dalam kotak hijau. Area scanning
						sudah diperbesar untuk pembacaan lebih mudah.
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
										src={result.volunteer.foto || "/default-avatar.png"}
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
										Status:{" "}
										<span className="font-medium">{result.details}</span>
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
					<p className="text-blue-800 font-medium text-sm sm:text-base">
						Scanner belum aktif
					</p>
					<p className="text-blue-600 text-xs sm:text-sm mt-1">
						Klik "Mulai Scan" untuk memulai check-in volunteer
					</p>
				</div>
			)}
		</div>
	);
}

export default QrScanner;
