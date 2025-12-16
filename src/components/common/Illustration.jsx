import { motion } from "framer-motion";
import { AlertCircle, CheckCircle, Clock, Inbox, Mail, Shield } from "lucide-react";
/**
 * A component that renders a cute volunteer illustration.
 * It is used on the login page.
 */
export function LoginIllustration() {
	return (
		<motion.div
			initial={{ opacity: 0, x: -50 }}
			animate={{ opacity: 1, x: 0 }}
			transition={{ duration: 0.6 }}
			className="hidden lg:flex lg:w-1/2 bg-gradient-to-br justify-center items-center from-emerald-400 via-blue-500 to-emerald-400 relative overflow-hidden">
			<div className="absolute inset-0 bg-black/10"></div>
			<div className="relative z-10 flex flex-col items-center p-12 text-white text-center">
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
								<div className="absolute top-16 left-2 w-6 h-0.5 bg-white rounded rotate-6"></div>
								<div className="absolute top-20 left-2 w-6 h-0.5 bg-white rounded"></div>
								<div className="absolute top-24 left-2 w-6 h-0.5 bg-white rounded"></div>
								<div className="absolute top-16 right-2 w-6 h-0.5 bg-white rounded -rotate-6"></div>
								<div className="absolute top-20 right-2 w-6 h-0.5 bg-white rounded"></div>
								<div className="absolute top-24 right-2 w-6 h-0.5 bg-white rounded"></div>
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
					Selamat Datang!
				</motion.h1>
				<motion.p
					initial={{ y: 20, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ delay: 0.7, duration: 0.5 }}
					className="text-xl opacity-90 mb-8">
					Komunitas relawan ada di sini!
				</motion.p>
				<motion.p
					initial={{ y: 20, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ delay: 0.9, duration: 0.5 }}
					className="text-lg opacity-80">
					Bergabung ke komunitas relawan sekarang dan mulai berkontribusi untuk mengubah dunia!
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

export function RegisterIllustration() {
	return (
		<motion.div
			initial={{ opacity: 0, x: -50 }}
			animate={{ opacity: 1, x: 0 }}
			transition={{ duration: 0.6 }}
			className="hidden lg:flex lg:w-1/2 bg-gradient-to-br justify-center items-center from-green-400 via-blue-500 to-blue-600 relative overflow-hidden">
			<div className="absolute inset-0 bg-black/10"></div>
			<div className="relative z-10 flex flex-col items-center p-20 text-white text-center">
				<motion.div
					initial={{ scale: 0.8, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					transition={{ delay: 0.3, duration: 0.5 }}
					className="mb-8">
					{/* Community Illustration */}
					<div className="w-64 h-64 bg-white/20 rounded-full flex items-center justify-center mb-8 backdrop-blur-sm">
						<div className="relative">
							{/* Group of People */}
							<div className="flex items-center justify-center space-x-4">
								{/* Person 1 */}
								<div className="w-16 h-16 bg-yellow-400 rounded-full relative">
									{/* Eyes */}
									<div className="absolute top-4 left-3 w-2 h-2 bg-white rounded-full"></div>
									<div className="absolute top-4 right-3 w-2 h-2 bg-white rounded-full"></div>
									{/* Smile */}
									<div className="absolute top-7 left-1/2 transform -translate-x-1/2 w-4 h-2 border-b-2 border-white rounded-full"></div>
								</div>

								{/* Person 2 (Center - Larger) */}
								<div className="w-20 h-20 bg-pink-400 rounded-full relative">
									{/* Eyes */}
									<div className="absolute top-5 left-4 w-2 h-2 bg-white rounded-full"></div>
									<div className="absolute top-5 right-4 w-2 h-2 bg-white rounded-full"></div>
									{/* Smile */}
									<div className="absolute top-9 left-1/2 transform -translate-x-1/2 w-5 h-2 border-b-2 border-white rounded-full"></div>
								</div>

								{/* Person 3 */}
								<div className="w-16 h-16 bg-blue-400 rounded-full relative">
									{/* Eyes */}
									<div className="absolute top-4 left-3 w-2 h-2 bg-white rounded-full"></div>
									<div className="absolute top-4 right-3 w-2 h-2 bg-white rounded-full"></div>
									{/* Smile */}
									<div className="absolute top-7 left-1/2 transform -translate-x-1/2 w-4 h-2 border-b-2 border-white rounded-full"></div>
								</div>
							</div>

							{/* Hearts floating around */}
							<div className="absolute -top-4 left-8 w-3 h-3 bg-red-400 transform rotate-45 rounded-sm"></div>
							<div className="absolute -top-2 right-8 w-2 h-2 bg-pink-300 transform rotate-45 rounded-sm"></div>
							<div className="absolute -bottom-4 left-12 w-4 h-4 bg-red-300 transform rotate-45 rounded-sm"></div>
						</div>
					</div>
				</motion.div>

				<motion.h1
					initial={{ y: 20, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ delay: 0.5, duration: 0.5 }}
					className="text-4xl font-bold mb-4">
					Gabung ke komunitas kami!
				</motion.h1>
				<motion.p
					initial={{ y: 20, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ delay: 0.7, duration: 0.5 }}
					className="text-xl opacity-90 mb-8">
					membangun relasi dengan relawan hebat
				</motion.p>
				<motion.p
					initial={{ y: 20, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ delay: 0.9, duration: 0.5 }}
					className="text-lg opacity-80">
					Mulai perjalanan relawan Anda hari ini dan buat koneksi yang berarti!
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

// Forgot Password Illustration Component
export function ForgotPasswordIllustration() {
	return (
		<motion.div
			initial={{ opacity: 0, x: -50 }}
			animate={{ opacity: 1, x: 0 }}
			transition={{ duration: 0.6 }}
			className="hidden lg:flex lg:w-1/2 bg-gradient-to-br justify-center items-center from-purple-400 via-blue-500 to-indigo-600 relative overflow-hidden">
			<div className="absolute inset-0 bg-black/10"></div>
			<div className="relative z-10 flex flex-col items-center p-24 text-white text-center">
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

// Email Pending Illustration Component
export function EmailPendingIllustration() {
	return (
		<motion.div
			initial={{ opacity: 0, x: -50 }}
			animate={{ opacity: 1, x: 0 }}
			transition={{ duration: 0.6 }}
			className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-600 relative overflow-hidden">
			<div className="absolute inset-0 bg-black/10"></div>
			<div className="relative z-10 flex flex-col justify-center items-center p-12 text-white text-center">
				<motion.div
					initial={{ scale: 0.8, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					transition={{ delay: 0.3, duration: 0.5 }}
					className="mb-8">
					{/* Email Pending Illustration */}
					<div className="w-64 h-64 bg-white/20 rounded-full flex items-center justify-center mb-8 backdrop-blur-sm">
						<div className="relative">
							{/* Inbox */}
							<div className="w-40 h-32 bg-white/30 rounded-lg relative flex items-center justify-center">
								{/* Inbox Box */}
								<div className="w-32 h-24 bg-white rounded-lg relative shadow-lg">
									<div className="absolute top-0 left-0 w-full h-8 bg-blue-500 rounded-t-lg flex items-center justify-center">
										<Inbox className="w-5 h-5 text-white" />
									</div>

									{/* Email Icon */}
									<div className="absolute top-10 left-1/2 transform -translate-x-1/2">
										<motion.div
											animate={{
												y: [0, -10, 0],
												scale: [1, 1.1, 1],
											}}
											transition={{
												duration: 2,
												repeat: Infinity,
												ease: "easeInOut",
											}}
											className="w-16 h-12 bg-blue-100 rounded-lg flex items-center justify-center shadow-md">
											<Mail className="w-8 h-8 text-blue-600" />
										</motion.div>
									</div>
								</div>

								{/* Flying Envelope Animation */}
								<motion.div
									animate={{
										x: [-100, 0],
										y: [20, 0],
										opacity: [0, 1],
									}}
									transition={{
										duration: 1.5,
										repeat: Infinity,
										repeatDelay: 2,
										ease: "easeOut",
									}}
									className="absolute -top-8 -left-12 w-10 h-8 bg-white/50 rounded-md flex items-center justify-center">
									<Mail className="w-5 h-5 text-blue-500" />
								</motion.div>
							</div>

							{/* Clock Icon (Pending) */}
							<motion.div
								animate={{ rotate: 360 }}
								transition={{
									duration: 8,
									repeat: Infinity,
									ease: "linear",
								}}
								className="absolute -bottom-6 -right-6 w-14 h-14 bg-white/40 rounded-full flex items-center justify-center backdrop-blur-sm shadow-lg">
								<Clock className="w-7 h-7" />
							</motion.div>

							{/* Floating Particles */}
							<motion.div
								animate={{ y: [-10, 10, -10] }}
								transition={{
									duration: 2,
									repeat: Infinity,
									ease: "easeInOut",
								}}
								className="absolute -top-6 -left-8 w-6 h-6 bg-white/40 rounded-full"></motion.div>

							<motion.div
								animate={{ y: [10, -10, 10] }}
								transition={{
									duration: 2.5,
									repeat: Infinity,
									ease: "easeInOut",
								}}
								className="absolute -top-4 -right-10 w-5 h-5 bg-white/40 rounded-full"></motion.div>

							<motion.div
								animate={{ y: [-5, 5, -5] }}
								transition={{
									duration: 3,
									repeat: Infinity,
									ease: "easeInOut",
								}}
								className="absolute -bottom-2 -left-10 w-4 h-4 bg-white/40 rounded-full"></motion.div>
						</div>
					</div>
				</motion.div>

				<motion.h1
					initial={{ y: 20, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ delay: 0.5, duration: 0.5 }}
					className="text-4xl font-bold mb-4">
					Verifikasi Email Anda
				</motion.h1>
				<motion.p
					initial={{ y: 20, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ delay: 0.7, duration: 0.5 }}
					className="text-xl opacity-90 mb-8">
					Satu langkah lagi untuk bergabung!
				</motion.p>
				<motion.p
					initial={{ y: 20, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ delay: 0.9, duration: 0.5 }}
					className="text-lg opacity-80">
					Cek inbox email Anda dan klik link verifikasi yang kami kirimkan
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

// Email Verification Illustration Component
export function EmailVerificationIllustration({ status }) {
	return (
		<motion.div
			initial={{ opacity: 0, x: -50 }}
			animate={{ opacity: 1, x: 0 }}
			transition={{ duration: 0.6 }}
			className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 relative overflow-hidden">
			<div className="absolute inset-0 bg-black/10"></div>
			<div className="relative z-10 flex flex-col justify-center items-center p-12 text-white text-center">
				<motion.div
					initial={{ scale: 0.8, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					transition={{ delay: 0.3, duration: 0.5 }}
					className="mb-8">
					{/* Email Verification Illustration */}
					<div className="w-64 h-64 bg-white/20 rounded-full flex items-center justify-center mb-8 backdrop-blur-sm">
						<div className="relative">
							{/* Email Envelope */}
							<div className="w-32 h-24 bg-white/30 rounded-lg relative flex items-center justify-center">
								{/* Envelope Flap */}
								<motion.div
									animate={status === "success" ? { rotateX: [0, -180, -180] } : { rotateX: 0 }}
									transition={{ duration: 1.5, delay: 0.5 }}
									className="absolute top-0 left-0 w-full h-12 bg-white/40 origin-top"
									style={{
										clipPath: "polygon(0 0, 50% 100%, 100% 0)",
									}}></motion.div>

								{/* Email Content */}
								<div className="w-24 h-16 bg-white rounded-md flex items-center justify-center">
									<Mail className="w-12 h-12 text-blue-500" />
								</div>

								{/* Verification Badge */}
								{status === "success" && (
									<motion.div
										initial={{ scale: 0, rotate: -180 }}
										animate={{ scale: 1, rotate: 0 }}
										transition={{ delay: 1, duration: 0.5 }}
										className="absolute -top-4 -right-4 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
										<CheckCircle className="w-8 h-8 text-white" />
									</motion.div>
								)}

								{status === "error" && (
									<motion.div
										initial={{ scale: 0 }}
										animate={{ scale: 1 }}
										transition={{ delay: 0.5, duration: 0.5 }}
										className="absolute -top-4 -right-4 w-12 h-12 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
										<AlertCircle className="w-8 h-8 text-white" />
									</motion.div>
								)}
							</div>

							{/* Floating Shield (Security) */}
							<motion.div
								animate={{ y: [-5, 5, -5], rotate: [0, 5, -5, 0] }}
								transition={{
									duration: 3,
									repeat: Infinity,
									ease: "easeInOut",
								}}
								className="absolute -bottom-6 -left-6 w-12 h-12 bg-white/40 rounded-full flex items-center justify-center backdrop-blur-sm">
								<Shield className="w-6 h-6" />
							</motion.div>

							{/* Floating Particles */}
							<motion.div
								animate={{ y: [-10, 10, -10] }}
								transition={{
									duration: 2,
									repeat: Infinity,
									ease: "easeInOut",
								}}
								className="absolute -top-8 -right-6 w-6 h-6 bg-white/40 rounded-full"></motion.div>

							<motion.div
								animate={{ y: [10, -10, 10] }}
								transition={{
									duration: 2.5,
									repeat: Infinity,
									ease: "easeInOut",
								}}
								className="absolute -bottom-4 -right-8 w-4 h-4 bg-white/40 rounded-full"></motion.div>
						</div>
					</div>
				</motion.div>

				<motion.h1
					initial={{ y: 20, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ delay: 0.5, duration: 0.5 }}
					className="text-4xl font-bold mb-4">
					Verifikasi Email
				</motion.h1>
				<motion.p
					initial={{ y: 20, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ delay: 0.7, duration: 0.5 }}
					className="text-xl opacity-90 mb-8">
					Konfirmasi akun Anda
				</motion.p>
				<motion.p
					initial={{ y: 20, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ delay: 0.9, duration: 0.5 }}
					className="text-lg opacity-80">
					Kami sedang memverifikasi email Anda untuk mengaktifkan akun
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
