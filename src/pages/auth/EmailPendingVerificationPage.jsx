import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, CheckCircle, RotateCcw, Clock, ArrowLeft, Inbox, Loader2 } from "lucide-react";
import DynamicButton from "@/components/ui/Button";
import { useResendVerification, useAuthStore } from "@/_hooks/useAuth";
import { useDocumentTitle } from "@/_hooks/utils/useDocumentTitle";
import { EmailPendingIllustration } from "@/components/common/Illustration";

export default function EmailVerificationPendingPage() {
	useDocumentTitle("Verifikasi Email - Menunggu");

	const location = useLocation();
	const navigate = useNavigate();
	const resendVerificationMutation = useResendVerification();
	const { isLoading } = useAuthStore();

	const [email, setEmail] = useState("");
	const [userName, setUserName] = useState("");
	const [canResend, setCanResend] = useState(true);
	const [countdown, setCountdown] = useState(0);
	const [isInitialized, setIsInitialized] = useState(false);

	useEffect(() => {
		// Cek apakah ada pendingUser di localStorage
		let foundEmail = "";
		let foundName = "";

		// 1. Prioritas pertama: dari state navigation (fresh dari register)
		const stateEmail = location.state?.email;
		const stateUserName = location.state?.userName;

		if (stateEmail) {
			foundEmail = stateEmail;
			foundName = stateUserName || "";
			setEmail(stateEmail);
			setUserName(foundName);
		} else {
			// 2. Fallback: cek localStorage
			try {
				const pendingUser = localStorage.getItem("pendingUser");
				if (pendingUser) {
					const userData = JSON.parse(pendingUser);
					foundEmail = userData.email || "";
					foundName = userData.nama || "";
					setEmail(foundEmail);
					setUserName(foundName);
				}
			} catch (e) {
				// JSON parse error, hapus corrupt data
				localStorage.removeItem("pendingUser");
			}
		}

		// Set initialized flag
		setIsInitialized(true);

		// PROTEKSI: Jika tidak ada email sama sekali (tidak ada pendingUser),
		// berarti user tidak punya akses ke halaman ini
		if (!foundEmail) {
			navigate("/login", { replace: true });
		}
	}, [location.state, navigate]);

	useEffect(() => {
		// Countdown timer untuk resend
		if (countdown > 0) {
			const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
			return () => clearTimeout(timer);
		} else {
			setCanResend(true);
		}
	}, [countdown]);

	const handleResendEmail = () => {
		if (!canResend || !email) return;

		resendVerificationMutation.mutate(email, {
			onSuccess: () => {
				setCanResend(false);
				setCountdown(60); // 60 detik cooldown
			},
		});
	};

	const handleBackToRegister = () => {
		// Hapus pending user dari localStorage
		try {
			localStorage.removeItem("pendingUser");
		} catch (e) {
			// ignore
		}
		navigate("/register");
	};

	// Show loading jika belum initialized atau email kosong
	if (!isInitialized || !email) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
			</div>
		);
	}

	return (
		<div className="min-h-screen flex">
			{/* Left Side - Illustration */}
			<EmailPendingIllustration />

			{/* Right Side - Verification Pending */}
			<div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
				<div className="w-full max-w-md">
					{/* Back Button */}
					<button
						onClick={handleBackToRegister}
						className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-8 transition-colors">
						<ArrowLeft className="w-4 h-4 mr-2" />
						Kembali ke registrasi
					</button>

					<motion.div
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ duration: 0.5 }}
						className="text-center">
						{/* Icon */}
						<div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 relative">
							<Mail className="w-8 h-8 text-blue-600" />
							<motion.div
								animate={{ scale: [1, 1.2, 1] }}
								transition={{
									duration: 2,
									repeat: Infinity,
									ease: "easeInOut",
								}}
								className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
								<Clock className="w-4 h-4 text-white" />
							</motion.div>
						</div>

						{/* Header */}
						<h2 className="text-2xl font-bold text-gray-900 mb-4">Cek Email Anda</h2>

						{userName && (
							<p className="text-gray-600 mb-2">
								Halo <span className="font-semibold text-gray-800">{userName}</span>!
							</p>
						)}

						<p className="text-gray-600 mb-2">Kami telah mengirimkan email verifikasi ke:</p>
						<p className="text-blue-600 font-medium text-md mb-6">{email}</p>

						{/* Instructions */}
						<div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8 text-left">
							<h3 className="font-semibold text-gray-800 mb-3 flex items-center">
								<CheckCircle className="w-5 h-5 mr-2 text-blue-600" />
								Langkah Selanjutnya:
							</h3>
							<ol className="space-y-2 text-sm text-gray-700">
								<li className="flex items-start">
									<span className="font-semibold mr-2">1.</span>
									<span>Buka inbox email Anda</span>
								</li>
								<li className="flex items-start">
									<span className="font-semibold mr-2">2.</span>
									<span>Cari email dari RelaOne dengan subjek "Verifikasi Email"</span>
								</li>
								<li className="flex items-start">
									<span className="font-semibold mr-2">3.</span>
									<span>Klik link verifikasi di dalam email</span>
								</li>
								<li className="flex items-start">
									<span className="font-semibold mr-2">4.</span>
									<span>Anda akan diarahkan untuk login</span>
								</li>
							</ol>
						</div>

						{/* Tips */}
						<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8 text-left">
							<p className="text-sm text-gray-700">
								<span className="font-semibold">💡 Tips:</span> Jika email tidak ada di inbox, coba
								cek folder <span className="font-semibold">Spam</span> atau{" "}
								<span className="font-semibold">Promosi</span>.
							</p>
						</div>

						{/* Resend Button */}
						<div className="space-y-3">
							<p className="text-sm text-gray-600">Tidak menerima email?</p>
							<DynamicButton
								onClick={handleResendEmail}
								loading={isLoading}
								disabled={!canResend || isLoading}
								variant="outline"
								className="w-full  py-3 rounded-lg font-medium transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
								{!isLoading && <RotateCcw className="w-4 h-4 mr-2" />}
								{!canResend && countdown > 0 ? `Kirim Ulang (${countdown}s)` : "Kirim Ulang Email"}
							</DynamicButton>

							<DynamicButton
								onClick={() => navigate("/login")}
								variant="success"
								className="w-full py-3 rounded-lg font-medium transition-all ">
								Sudah Verifikasi? Login Sekarang
							</DynamicButton>
						</div>
					</motion.div>
				</div>
			</div>
		</div>
	);
}
