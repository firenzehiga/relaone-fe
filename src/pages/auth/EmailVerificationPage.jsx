import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, AlertCircle, Loader2, Mail } from "lucide-react";
import DynamicButton from "@/components/ui/DynamicButton";
import { useVerifyEmail } from "@/_hooks/useAuth";
import { useDocumentTitle } from "@/_hooks/utils/useDocumentTitle";
import { EmailVerificationIllustration } from "@/components/common/Illustration";

export default function EmailVerificationPage() {
	useDocumentTitle("Verifikasi Email");

	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	const { mutate, isSuccess, isError, error, isPending, data } = useVerifyEmail();
	const [localError, setLocalError] = useState("");
	const [shouldRender, setShouldRender] = useState(false);
	const [hasCalledApi, setHasCalledApi] = useState(false); // 🔒 Prevent multiple API calls

	useEffect(() => {
		// Ambil parameter dari URL
		const id = searchParams.get("id");
		const hash = searchParams.get("hash");
		const expires = searchParams.get("expires");
		const signature = searchParams.get("signature");

		// 🔒 PROTEKSI: Validasi parameter - redirect jika tidak lengkap
		if (!id || !hash || !expires || !signature) {
			navigate("/login", { replace: true });
			return;
		}

		// 🔒 Validasi expires SEBELUM hit backend
		const expiresTimestamp = parseInt(expires, 10);
		const currentTimestamp = Math.floor(Date.now() / 1000);

		if (!isNaN(expiresTimestamp) && currentTimestamp > expiresTimestamp) {
			setLocalError("Link verifikasi sudah kadaluarsa. Silakan kirim ulang email verifikasi.");
			setShouldRender(true);
			return;
		}

		// 🔒 Prevent spam: Only call API once per session
		if (hasCalledApi) {
			return;
		}

		// Izinkan render dan panggil mutation
		setShouldRender(true);
		setHasCalledApi(true);
		mutate({ id, hash, expires, signature });
	}, [mutate, searchParams, navigate, hasCalledApi]);

	// Jangan render apapun sampai validasi selesai
	if (!shouldRender) {
		return null;
	}

	// Determine status for illustration
	const status = localError ? "error" : isSuccess ? "success" : isError ? "error" : "verifying";

	return (
		<div className="min-h-screen flex">
			{/* Left Side - Illustration */}
			<EmailVerificationIllustration status={status} />

			{/* Right Side - Verification Status */}
			<div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
				<div className="w-full max-w-md">
					{/* Verifying State */}
					{isPending && !localError && (
						<motion.div
							initial={{ opacity: 0, scale: 0.9 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ duration: 0.5 }}
							className="text-center">
							<div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
								<Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
							</div>

							<h2 className="text-3xl font-bold text-gray-900 mb-4">Memverifikasi Email</h2>
							<p className="text-gray-600 mb-6">
								Mohon tunggu sebentar, kami sedang memverifikasi email Anda...
							</p>

							<div className="flex justify-center">
								<div className="flex space-x-2">
									<div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
									<div
										className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"
										style={{ animationDelay: "0.1s" }}></div>
									<div
										className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"
										style={{ animationDelay: "0.2s" }}></div>
								</div>
							</div>
						</motion.div>
					)}

					{/* Success State */}
					{isSuccess && (
						<motion.div
							initial={{ opacity: 0, scale: 0.9 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ duration: 0.5 }}
							className="text-center">
							<motion.div
								initial={{ scale: 0 }}
								animate={{ scale: 1 }}
								transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
								className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
								<CheckCircle className="w-10 h-10 text-green-600" />
							</motion.div>

							<h2 className="text-3xl font-bold text-gray-900 mb-4">
								Email Berhasil Diverifikasi!
							</h2>
							<p className="text-gray-600 mb-4">
								{data?.message || "Email Anda telah berhasil diverifikasi!"}
							</p>
							<DynamicButton
								variant="success"
								onClick={() => navigate("/login")}
								className="w-full py-3 rounded-lg font-medium transition-all transform hover:scale-105">
								Login Sekarang
							</DynamicButton>
						</motion.div>
					)}

					{/* Error State */}
					{(isError || localError) && (
						<motion.div
							initial={{ opacity: 0, scale: 0.9 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ duration: 0.5 }}
							className="text-center">
							<div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
								<AlertCircle className="w-10 h-10 text-red-600" />
							</div>

							<h2 className="text-3xl font-bold text-gray-900 mb-4">Verifikasi Gagal</h2>
							<p className="text-gray-600 mb-2">
								{localError || error?.message || "Terjadi kesalahan saat memverifikasi email."}
							</p>
							{/* Tips */}
							<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8 text-left">
								<p className="text-sm text-gray-700">
									<span className="font-semibold">💡 Tips:</span> Pastikan anda mengklik link
									verifikasi sebelum kadaluarsa. Jika link sudah kadaluarsa, silakan kirim ulang
									email verifikasi.
								</p>
							</div>

							<div className="space-y-3">
								<DynamicButton
									onClick={() => navigate("/email-verification-pending")}
									variant="outline"
									className="w-full py-3 rounded-lg font-medium transition-all">
									<Mail className="w-4 h-4 mr-2" />
									Kirim Ulang Email Verifikasi
								</DynamicButton>
							</div>
						</motion.div>
					)}
				</div>
			</div>
		</div>
	);
}
