import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { showToast } from "@/components/ui/Toast";
import { Mail, ArrowLeft, Heart, CheckCircle, RotateCcw } from "lucide-react";

import { useForgotPassword, useAuthStore } from "@/_hooks/useAuth";
import { useDocumentTitle } from "@/_hooks/utils/useDocumentTitle";

import DynamicButton from "@/components/ui/DynamicButton";
import { ForgotPasswordIllustration } from "@/components/common/Illustration";

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
									// initial={{ y: 10, opacity: 0 }}
									// animate={{ y: 0, opacity: 1 }}
									// transition={{ delay: 0.4, duration: 0.5 }}
									onSubmit={handleSubmit}
									className="space-y-6">
									{/* Email Field */}
									<div>
										<label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
											Email
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
										Login
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
