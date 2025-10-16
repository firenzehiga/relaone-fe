import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, ArrowLeft, Heart } from "lucide-react";
import Button from "@/components/ui/Button";

const LoginPage = () => {
	const [formData, setFormData] = useState({
		email: "",
		password: "",
		rememberMe: false,
	});
	const [showPassword, setShowPassword] = useState(false);

	const handleInputChange = (e) => {
		const { name, value, type, checked } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: type === "checkbox" ? checked : value,
		}));
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		console.log("Login attempt:", formData);
		// Handle login logic here
	};

	return (
		<div className="min-h-screen flex">
			{/* Left Side - Illustration */}
			<motion.div
				initial={{ opacity: 0, x: -50 }}
				animate={{ opacity: 1, x: 0 }}
				transition={{ duration: 0.6 }}
				className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-400 relative overflow-hidden">
				<div className="absolute inset-0 bg-black/10"></div>
				<div className="relative z-10 flex flex-col justify-center items-center p-12 text-white text-center">
					<motion.div
						initial={{ scale: 0.8, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						transition={{ delay: 0.3, duration: 0.5 }}
						className="mb-8">
						{/* Cute Volunteer Illustration */}
						<div className="w-64 h-64 bg-white/20 rounded-full flex items-center justify-center mb-8 backdrop-blur-sm">
							<div className="relative">
								{/* Cat Character */}
								<div className="w-32 h-32 bg-orange-400 rounded-full relative">
									{/* Ears */}
									<div className="absolute -top-4 left-6 w-6 h-8 bg-orange-400 rounded-full transform rotate-12"></div>
									<div className="absolute -top-4 right-6 w-6 h-8 bg-orange-400 rounded-full transform -rotate-12"></div>
									{/* Eyes */}
									<div className="absolute top-8 left-8 w-4 h-4 bg-white rounded-full">
										<div className="w-2 h-2 bg-black rounded-full mt-1 ml-1"></div>
									</div>
									<div className="absolute top-8 right-8 w-4 h-4 bg-white rounded-full">
										<div className="w-2 h-2 bg-black rounded-full mt-1 ml-1"></div>
									</div>
									{/* Nose */}
									<div className="absolute top-12 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-pink-300 rounded-full"></div>
									{/* Mouth */}
									<div className="absolute top-14 left-1/2 transform -translate-x-1/2 w-6 h-2 border-b-2 border-white rounded-full"></div>
									{/* Whiskers */}
									<div className="absolute top-11 left-2 w-6 h-0.5 bg-white rounded"></div>
									<div className="absolute top-13 left-2 w-6 h-0.5 bg-white rounded"></div>
									<div className="absolute top-11 right-2 w-6 h-0.5 bg-white rounded"></div>
									<div className="absolute top-13 right-2 w-6 h-0.5 bg-white rounded"></div>
								</div>
								{/* Arms */}
								<div className="absolute -bottom-2 -left-4 w-8 h-12 bg-orange-400 rounded-full transform rotate-12"></div>
								<div className="absolute -bottom-2 -right-4 w-8 h-12 bg-orange-400 rounded-full transform -rotate-12"></div>
							</div>
						</div>
					</motion.div>

					<motion.h1
						initial={{ y: 20, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						transition={{ delay: 0.5, duration: 0.5 }}
						className="text-4xl font-bold mb-4">
						Welcome Back!
					</motion.h1>
					<motion.p
						initial={{ y: 20, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						transition={{ delay: 0.7, duration: 0.5 }}
						className="text-xl opacity-90 mb-8">
						Your volunteer community is here!
					</motion.p>
					<motion.p
						initial={{ y: 20, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						transition={{ delay: 0.9, duration: 0.5 }}
						className="text-lg opacity-80">
						Join our amazing volunteer platform and make a difference!
					</motion.p>
				</div>

				{/* Decorative Elements */}
				<div className="absolute top-20 left-20 w-4 h-4 bg-white/30 rounded-full animate-pulse"></div>
				<div className="absolute top-40 right-32 w-6 h-6 bg-white/20 rounded-full animate-pulse delay-1000"></div>
				<div className="absolute bottom-32 left-16 w-8 h-8 bg-white/25 rounded-full animate-pulse delay-500"></div>
				<div className="absolute bottom-20 right-20 w-3 h-3 bg-white/40 rounded-full animate-pulse delay-700"></div>
			</motion.div>

			{/* Right Side - Login Form */}
			<motion.div
				initial={{ opacity: 0, x: 50 }}
				animate={{ opacity: 1, x: 0 }}
				transition={{ duration: 0.6 }}
				className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
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
						initial={{ y: 20, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						transition={{ delay: 0.2, duration: 0.5 }}
						className="mb-8">
						<h2 className="text-3xl font-bold text-gray-900 mb-2">Sign In</h2>
						<p className="text-gray-600">Enter your credentials to continue</p>
					</motion.div>

					{/* Login Form */}
					<motion.form
						initial={{ y: 20, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						transition={{ delay: 0.4, duration: 0.5 }}
						onSubmit={handleSubmit}
						className="space-y-6">
						{/* Email Field */}
						<div>
							<label
								htmlFor="email"
								className="block text-sm font-medium text-gray-700 mb-1">
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
									className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
									placeholder="your@example.com"
									required
								/>
							</div>
						</div>

						{/* Password Field */}
						<div>
							<label
								htmlFor="password"
								className="block text-sm font-medium text-gray-700 mb-1">
								Password
							</label>
							<div className="relative">
								<Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
								<input
									type={showPassword ? "text" : "password"}
									id="password"
									name="password"
									value={formData.password}
									onChange={handleInputChange}
									className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
									placeholder="••••••••"
									required
								/>
								<button
									type="button"
									onClick={() => setShowPassword(!showPassword)}
									className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
									{showPassword ? (
										<EyeOff className="w-5 h-5" />
									) : (
										<Eye className="w-5 h-5" />
									)}
								</button>
							</div>
						</div>

						{/* Remember Me & Forgot Password */}
						<div className="flex items-center justify-between">
							<label className="flex items-center">
								<input
									type="checkbox"
									name="rememberMe"
									checked={formData.rememberMe}
									onChange={handleInputChange}
									className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
								/>
								<span className="ml-2 text-sm text-gray-600">Remember me</span>
							</label>
							<Link
								to="/forgot-password"
								className="text-sm text-blue-600 hover:text-blue-800">
								Forgot password?
							</Link>
						</div>

						{/* Submit Button */}
						<Button
							type="submit"
							className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 rounded-lg font-medium transition-all transform hover:scale-105">
							Sign In
						</Button>

						{/* Divider */}
						<div className="relative my-6">
							<div className="absolute inset-0 flex items-center">
								<div className="w-full border-t border-gray-300"></div>
							</div>
							<div className="relative flex justify-center text-sm">
								<span className="px-2 bg-white text-gray-500">
									Or continue with
								</span>
							</div>
						</div>

						{/* Social Login */}
						<div className="grid grid-cols-2 gap-3">
							<button
								type="button"
								className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
								<svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
									<path
										fill="currentColor"
										d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
									/>
									<path
										fill="currentColor"
										d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
									/>
									<path
										fill="currentColor"
										d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
									/>
									<path
										fill="currentColor"
										d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
									/>
								</svg>
								Google
							</button>
							<button
								type="button"
								className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
								<svg
									className="w-5 h-5 mr-2"
									fill="currentColor"
									viewBox="0 0 24 24">
									<path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
								</svg>
								GitHub
							</button>
						</div>
					</motion.form>

					{/* Sign Up Link */}
					<motion.p
						initial={{ y: 20, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						transition={{ delay: 0.6, duration: 0.5 }}
						className="text-center text-gray-600 mt-8">
						Don't have an account?{" "}
						<Link
							to="/register"
							className="text-blue-600 hover:text-blue-800 font-medium">
							Sign up
						</Link>
					</motion.p>

					{/* Footer Text */}
					<motion.p
						initial={{ y: 20, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						transition={{ delay: 0.8, duration: 0.5 }}
						className="text-center text-gray-500 text-sm mt-4 flex items-center justify-center">
						Made with <Heart className="w-4 h-4 mx-1 text-red-500" /> for
						volunteers
					</motion.p>
				</div>
			</motion.div>
		</div>
	);
};

export default LoginPage;
