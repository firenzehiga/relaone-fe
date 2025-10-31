import { motion } from "framer-motion";
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
			className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-emerald-400 via-blue-500 to-emerald-400 relative overflow-hidden">
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
					Bergabung ke komunitas relawan sekarang dan mulai berkontribusi untuk
					mengubah dunia!
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
			className="hidden lg:flex lg:w-2/2 bg-gradient-to-br from-green-400 via-blue-500 to-blue-600 relative overflow-hidden">
			<div className="absolute inset-0 bg-black/10"></div>
			<div className="relative z-10 flex flex-col justify-center items-center p-12 text-white text-center">
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
