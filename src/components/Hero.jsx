import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import DynamicButton from "@/components/ui/DynamicButton";
import { useAuthStore } from "@/_hooks/useAuth";
import GradientText from "./ui/GradientText";
export default function Hero() {
	const navigate = useNavigate();
	const { isAuthenticated } = useAuthStore();

	return (
		<section className="relative w-full min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-blue-50 via-green-50 to-purple-50">
			{/* Background Decorations */}
			<div className="absolute inset-0 w-full pointer-events-none">
				<div className="absolute top-0 left-0 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float"></div>
				<div className="absolute top-0 right-0 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float"></div>
				<div className="absolute bottom-32 left-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float"></div>
			</div>

			<div className="relative w-full h-full">
				<div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
					{/* Left Side - CTA Content */}
					<motion.div
						initial={{ opacity: 0, x: -50 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.5 }}
						exit={{ opacity: 0 }}
						className="flex flex-col justify-center px-8 sm:px-10 lg:px-12 xl:px-16 py-9 lg:py-20">
						<div className="max-w-xl">
							<h1 className="text-5xl sm:text-6xl lg:text-6xl xl:text-6xl font-bold text-gray-900 mb-6 leading-tight">
								Bergabung dalam
								<GradientText
									colors={["#059669", "#059669", "#10b981", "#3b82f6", "#059669"]}
									animationSpeed={6}
									showBorder={false}
									className="block text-transparent bg-clip-text mt-3">
									Aksi Sosial
								</GradientText>
								yang Bermakna
							</h1>
							<p className="text-lg lg:text-xl text-gray-600 mb-8 leading-relaxed">
								Platform yang menghubungkan para relawan dengan organisasi untuk berbagai kegiatan
								sosial. Mari bersama-sama membuat perubahan positif untuk masyarakat.
							</p>

							<div className="flex flex-col sm:flex-row gap-4">
								<DynamicButton
									size="lg"
									variant="success"
									onClick={() => navigate("/events")}
									className="group">
									Lihat Kegiatan
									<ArrowRight
										size={20}
										className="ml-2 group-hover:translate-x-1 transition-transform"
									/>
								</DynamicButton>
								{/* jika belum login diarahkan ke register, kalo sudah dibuat scroll sedikit kebawah */}
								<DynamicButton
									size="lg"
									variant="outline"
									onClick={() =>
										navigate({
											pathname: isAuthenticated
												? scrollTo({ top: 1800, behavior: "smooth" })
												: "/register",
										})
									}>
									Bergabung
								</DynamicButton>
							</div>
						</div>
					</motion.div>

					{/* Right Side - Full Height Image */}
					<motion.div
						initial={{ opacity: 0, x: 50 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.5 }}
						exit={{ opacity: 0 }}
						className="relative h-full min-h-[400px] lg:min-h-screen">
						<div className="absolute inset-0 lg:inset-y-0 lg:right-0">
							<img
								src={"/images/hero.avif"}
								alt="Volunteer activities"
								className="w-full h-full object-cover rounded-tl-[100px] shadow-2xl"
							/>
							<div className="absolute inset-0 bg-gradient-to-t rounded-tl-[40px] lg:bg-gradient-to-r from-black/40 via-black/10 to-transparent lg:rounded-tl-[100px]" />
						</div>
					</motion.div>
				</div>
			</div>

			{/* Wave Shape Divider */}
			<div className="absolute bottom-0 left-0 right-0 -mb-1 z-10">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 1440 120"
					preserveAspectRatio="none"
					className="w-full h-20 sm:h-24 md:h-28 lg:h-30 xl:h-32">
					<path
						fill="#059669"
						fillOpacity="1"
						d="M0,96L48,85.3C96,75,192,53,288,53.3C384,53,480,75,576,85.3C672,96,768,96,864,90.7C960,85,1056,75,1152,64C1248,53,1344,43,1392,37.3L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"></path>
				</svg>
			</div>
		</section>
	);
}
