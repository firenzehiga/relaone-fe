import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { showToast } from "@/components/ui/Toast";
import { Mail, ArrowLeft, Heart, CheckCircle, RotateCcw } from "lucide-react";

import { useForgotPassword, useAuthStore } from "@/_hooks/useAuth";
import { useDocumentTitle } from "@/_hooks/useDocumentTitle";

import DynamicButton from "@/components/ui/Button";
// Forgot Password Illustration Component
function ForgotPasswordIllustration() {
	return (
		<motion.div
			initial={{ opacity: 0, x: -50 }}
			animate={{ opacity: 1, x: 0 }}
			transition={{ duration: 0.6 }}
			className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-purple-400 via-blue-500 to-indigo-600 relative overflow-hidden">
			<div className="absolute inset-0 bg-black/10"></div>
			<div className="relative z-10 flex flex-col justify-center items-center p-12 text-white text-center">
				<motion.div
					initial={{ scale: 0.8, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					transition={{ delay: 0.3, duration: 0.5 }}
					className="mb-8">
					{/* Reset Password Illustration */}
					<div className="w-64 h-64 bg-white/20 rounded-full flex items-center justify-center mb-8 backdrop-blur-sm">
						<div className="relative">
							{/* Lock with Key */}
							<div className="w-24 h-24 bg-white/30 rounded-lg relative flex items-center justify-center">
								{/* Lock Body */}
								<div className="w-16 h-20 bg-gray-300 rounded-lg relative">
									{/* Lock Shackle */}
									<div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 border-4 border-gray-300 rounded-full border-b-transparent"></div>
									{/* Keyhole */}
									<div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-gray-500 rounded-full"></div>
									<div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-1 h-4 bg-gray-500"></div>
								</div>

								{/* Key */}
								<motion.div
									animate={{ rotate: [0, 10, -10, 0] }}
									transition={{
										duration: 2,
										repeat: Infinity,
										ease: "easeInOut",
									}}
									className="absolute -right-8 top-4 w-8 h-2 bg-yellow-400 rounded-full">
									{/* Key Head */}
									<div className="absolute -left-3 -top-1 w-4 h-4 bg-yellow-400 rounded-full border-2 border-yellow-500"></div>
									{/* Key Teeth */}
									<div className="absolute -right-1 -top-1 w-2 h-1 bg-yellow-400"></div>
									<div className="absolute -right-1 top-1 w-2 h-1 bg-yellow-400"></div>
								</motion.div>
							</div>

							{/* Floating Elements */}
							<motion.div
								animate={{ y: [-5, 5, -5] }}
								transition={{
									duration: 2,
									repeat: Infinity,
									ease: "easeInOut",
								}}
								className="absolute -top-8 -left-8 w-6 h-6 bg-white/40 rounded-full flex items-center justify-center">
								<Mail className="w-4 h-4" />
							</motion.div>

							<motion.div
								animate={{ y: [5, -5, 5] }}
								transition={{
									duration: 2.5,
									repeat: Infinity,
									ease: "easeInOut",
								}}
								className="absolute -top-4 -right-6 w-5 h-5 bg-green-400 rounded-full flex items-center justify-center">
								<CheckCircle className="w-3 h-3 text-white" />
							</motion.div>
						</div>
					</div>
				</motion.div>

				<motion.h1
					initial={{ y: 20, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ delay: 0.5, duration: 0.5 }}
					className="text-4xl font-bold mb-4">
					Lupa Password?
				</motion.h1>
				<motion.p
					initial={{ y: 20, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ delay: 0.7, duration: 0.5 }}
					className="text-xl opacity-90 mb-8">
					Jangan khawatir, kami bantu reset!
				</motion.p>
				<motion.p
					initial={{ y: 20, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ delay: 0.9, duration: 0.5 }}
					className="text-lg opacity-80">
					Masukkan email Anda dan kami akan kirimkan link untuk reset password
				</motion.p>
			</div>

			{/* Decorative Elements */}
			<div className="absolute top-20 left-20 w-4 h-4 bg-white/30 rounded-full animate-pulse"></div>
			<div className="absolute top-40 right-32 w-6 h-6 bg-white/20 rounded-full animate-pulse delay-1000"></div>
			<div className="absolute bottom-32 left-16 w-8 h-8 bg-white/25 rounded-full animate-pulse delay-500"></div>
			<div className="absolute bottom-20 right-20 w-3 h-3 bg-white/40 rounded-full animate-pulse delay-700"></div>
		</motion.div>
	);
}

export default function ForgotPasswordPage() {
	useDocumentTitle("Forgot Password");

	const [formData, setFormData] = useState({
		email: "",
	});
	const [isSuccess, setIsSuccess] = useState(false);

	const forgotPasswordMutation = useForgotPassword();
	const { isLoading } = useAuthStore();

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		// Basic validation
		if (!formData.email) {
			showToast({
				type: "error",
				title: "Email Diperlukan",
				message: "Mohon masukkan email Anda",
				duration: 2000,
				position: "top-center",
			});
			return;
		}

		// Call forgot password mutation
		forgotPasswordMutation.mutate(formData.email, {
			onSuccess: () => {
				setIsSuccess(true);
			},
		});
	};

	const handleResendEmail = () => {
		setIsSuccess(false);
		setFormData({ email: "" });
	};

	return (
		<AnimatePresence mode="wait">
			<div className="min-h-screen flex">
				{/* Left Side - Illustration */}
				<ForgotPasswordIllustration />

				{/* Right Side - Forgot Password Form */}
				<div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
					<div className="w-full max-w-md">
						{/* Back Button */}
						<Link
							to="/login"
							className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-8 transition-colors">
							<ArrowLeft className="w-4 h-4 mr-2" />
							Kembali ke Login
						</Link>

						{/* Success State */}
						{isSuccess ? (
							<motion.div
								initial={{ opacity: 0, scale: 0.9 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{ duration: 0.5 }}
								className="text-center">
								<div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
									<CheckCircle className="w-10 h-10 text-green-600" />
								</div>

								<h2 className="text-3xl font-bold text-gray-900 mb-4">Email Terkirim!</h2>
								<p className="text-gray-600 mb-2">Kami telah mengirimkan link reset password ke:</p>
								<p className="text-blue-600 font-medium mb-6">{formData.email}</p>
								<p className="text-sm text-gray-500 mb-8">
									Silakan cek email Anda dan ikuti petunjuk untuk reset password. Jika tidak ada di
									inbox, coba cek folder spam.
								</p>

								<DynamicButton
									onClick={handleResendEmail}
									variant="outline"
									className="w-full py-3 rounded-lg font-medium transition-all transform hover:scale-105">
									<RotateCcw className="w-4 h-4 mr-2" />
									Kirim Ulang Email
								</DynamicButton>
							</motion.div>
						) : (
							<>
								{/* Header */}
								<motion.div
									initial={{ y: 10, opacity: 0 }}
									animate={{ y: 0, opacity: 1 }}
									transition={{ delay: 0.2, duration: 0.5 }}
									className="mb-8">
									<h2 className="text-3xl font-bold text-gray-900 mb-2">Reset Password</h2>
									<p className="text-gray-600">
										Masukkan email Anda untuk menerima link reset password
									</p>
								</motion.div>

								{/* Forgot Password Form */}
								<motion.form
									initial={{ y: 10, opacity: 0 }}
									animate={{ y: 0, opacity: 1 }}
									transition={{ delay: 0.4, duration: 0.5 }}
									onSubmit={handleSubmit}
									className="space-y-6">
									{/* Email Field */}
									<div>
										<label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
											Email Address
										</label>
										<div className="relative">
											<Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
											<input
												type="email"
												id="email"
												name="email"
												value={formData.email}
												onChange={handleInputChange}
												className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
												placeholder="your@example.com"
												disabled={isLoading}
												required
											/>
										</div>
									</div>

									{/* Submit Button */}
									<DynamicButton
										type="submit"
										variant="success"
										disabled={isLoading || !formData.email}
										className="w-full text-white py-3 rounded-lg font-medium transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
										{isLoading ? (
											<div className="flex items-center justify-center space-x-2">
												<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
												<span>Mengirim Email...</span>
											</div>
										) : (
											<>
												<Mail className="w-4 h-4 mr-2 inline" />
												Kirim Reset Link
											</>
										)}
									</DynamicButton>
								</motion.form>

								{/* Back to Login Link */}
								<motion.p
									initial={{ y: 20, opacity: 0 }}
									animate={{ y: 0, opacity: 1 }}
									transition={{ delay: 0.6, duration: 0.5 }}
									className="text-center text-gray-600 mt-8">
									Sudah ingat password?{" "}
									<Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium">
										Sign in
									</Link>
								</motion.p>
							</>
						)}

						{/* Footer Text */}
						<motion.p
							initial={{ y: 20, opacity: 0 }}
							animate={{ y: 0, opacity: 1 }}
							transition={{ delay: 0.8, duration: 0.5 }}
							className="text-center text-gray-500 text-sm mt-8 flex items-center justify-center">
							Made with <Heart className="w-4 h-4 mx-1 text-red-500" /> for volunteers
						</motion.p>
					</div>
				</div>
			</div>
		</AnimatePresence>
	);
}
