import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, ArrowLeft, Heart } from "lucide-react";

import { useAuthStore, useLogin } from "@/_hooks/useAuth";
import { useDocumentTitle } from "@/_hooks/useDocumentTitle";

import { LoginIllustration } from "@/components/common/Illustration";
import DynamicButton from "@/components/ui/Button";

export default function LoginPage() {
	useDocumentTitle("Login Page");

	const [showPassword, setShowPassword] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting, isSubmitted, isValid },
	} = useForm({
		defaultValues: { email: "", password: "" },
		mode: "onChange",
		reValidateMode: "onChange",
	});

	const loginMutation = useLogin();
	const { isLoading } = useAuthStore();

	const onSubmit = async (data) => {
		try {
			await loginMutation.mutateAsync({ email: data.email, password: data.password });
			// optional: redirect or show success
		} catch (err) {
			// optional: handle server error (toast, setError, etc.)
			console.error(err);
		}
	};

	return (
		<AnimatePresence mode="wait">
			<div className="min-h-screen flex">
				{/* Left Side - Illustration */}
				<LoginIllustration />
				{/* Right Side - Login Form */}
				<div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
					<div className="w-full max-w-md">
						{/* Back Button */}
						<Link
							to="/"
							className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-8 transition-colors">
							<ArrowLeft className="w-4 h-4 mr-2" />
							Go Back
						</Link>

						{/* Header */}
						<motion.div
							initial={{ y: 10, opacity: 0 }}
							animate={{ y: 0, opacity: 1 }}
							transition={{ delay: 0.2, duration: 0.5 }}
							exit={{ opacity: 0 }}
							className="mb-8">
							<h2 className="text-3xl font-bold text-gray-900 mb-2">Sign In</h2>
							<p className="text-gray-600">Enter your credentials to continue</p>
						</motion.div>

						{/* Login Form */}
						<motion.form
							// initial={{ y: 10, opacity: 0 }}
							// animate={{ y: 0, opacity: 1 }}
							// transition={{ delay: 0.4, duration: 0.5 }}
							onSubmit={handleSubmit(onSubmit)}
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
										{...register("email", {
											required: "Email wajib diisi",
											pattern: {
												value: /^\S+@\S+$/i,
												message: "Format email tidak valid",
											},
										})}
										aria-invalid={!!errors.email}
										aria-describedby={errors.email ? "email-error" : undefined}
										className={`w-full pl-10 pr-4 py-3 border rounded-lg outline-none transition-all disabled:bg-gray-50 disabled:cursor-not-allowed ${
											isSubmitted && errors.email
												? "border-red-500 focus:ring-1 focus:ring-red-500"
												: "border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
										}`}
										placeholder="your@example.com"
										disabled={isLoading || isSubmitting}
									/>
								</div>
								{isSubmitted && errors.email && (
									<p id="email-error" className="text-xs text-red-600 mt-1">
										{errors.email.message}
									</p>
								)}
							</div>

							{/* Password Field */}
							<div>
								<label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
									Password
								</label>
								<div className="relative">
									<Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
									<input
										type={showPassword ? "text" : "password"}
										id="password"
										{...register("password", {
											required: "Password wajib diisi",
											minLength: { value: 8, message: "Password minimal 8 karakter" },
										})}
										aria-invalid={!!errors.password}
										aria-describedby={errors.password ? "password-error" : undefined}
										className={`w-full pl-10 pr-12 py-3 border rounded-lg outline-none transition-all disabled:bg-gray-50 disabled:cursor-not-allowed ${
											isSubmitted && errors.password
												? "border-red-500 focus:ring-1 focus:ring-red-500"
												: "border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
										}`}
										placeholder="••••••••"
										disabled={isLoading || isSubmitting}
									/>
									<button
										type="button"
										onClick={() => setShowPassword(!showPassword)}
										disabled={isLoading}
										className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:cursor-not-allowed">
										{showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
									</button>
								</div>
								{isSubmitted && errors.password && (
									<p id="password-error" className="text-xs text-red-600 mt-1">
										{errors.password.message}
									</p>
								)}
							</div>

							{/* Remember Me & Forgot Password */}
							<div className="flex items-center justify-end">
								{/* <label className="flex items-center">
									<input
										type="checkbox"
										name="rememberMe"
										checked={formData.rememberMe}
										onChange={handleInputChange}
										disabled={isLoading}
										className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:cursor-not-allowed"
									/>
									<span className="ml-2 text-sm text-gray-600">
										Remember me
									</span>
								</label> */}
								<Link to="/forgot-password" className="text-sm text-blue-600 hover:text-blue-800">
									Forgot password?
								</Link>
							</div>

							{/* Submit Button */}
							<DynamicButton
								type="submit"
								variant="success"
								disabled={isLoading || isSubmitting || !isValid}
								className="w-full text-white py-3 rounded-lg font-medium transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
								{isLoading ? (
									<div className="flex items-center justify-center space-x-2">
										<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
										<span>Signing In...</span>
									</div>
								) : (
									"Sign In"
								)}
							</DynamicButton>
						</motion.form>

						{/* Sign Up Link */}
						<motion.p
							initial={{ y: 20, opacity: 0 }}
							animate={{ y: 0, opacity: 1 }}
							transition={{ delay: 0.6, duration: 0.5 }}
							className="text-center text-gray-600 mt-8">
							Don't have an account?{" "}
							<Link to="/register" className="text-blue-600 hover:text-blue-800 font-medium">
								Sign up
							</Link>
						</motion.p>

						{/* Footer Text */}
						<motion.p
							initial={{ y: 20, opacity: 0 }}
							animate={{ y: 0, opacity: 1 }}
							transition={{ delay: 0.8, duration: 0.5 }}
							className="text-center text-gray-500 text-sm mt-4 flex items-center justify-center">
							Made with <Heart className="w-4 h-4 mx-1 text-red-500" /> for volunteers
						</motion.p>
					</div>
				</div>
			</div>
		</AnimatePresence>
	);
}
