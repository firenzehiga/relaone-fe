import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import DynamicButton from "@/components/ui/Button";
export default function Hero() {
	const navigate = useNavigate();

	return (
		<section className="relative w-full min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
			<div className="absolute inset-0 w-full">
				<div className="absolute top-0 left-0 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float"></div>
				<div className="absolute top-0 right-0 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float"></div>
				<div className="absolute bottom-0 left-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float"></div>
			</div>
			<div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-8">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
					<motion.div
						initial={{ opacity: 0, x: -50 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.8 }}
						exit={{ opacity: 0 }}
						className="flex flex-col justify-center">
						<h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-4 lg:mb-6 leading-tight">
							Bergabung dalam
							<span className="m-3 block text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-emerald-600">
								Aksi Sosial
							</span>
							yang Bermakna
						</h1>
						<p className="text-lg lg:text-xl text-gray-600 mb-6 lg:mb-8 leading-relaxed">
							Platform yang menghubungkan para volunteer dengan organisasi untuk
							berbagai kegiatan sosial. Mari bersama-sama membuat perubahan
							positif untuk masyarakat.
						</p>
						<div className="flex flex-col sm:flex-row gap-4">
							<DynamicButton
								size="lg"
								variant="success"
								onClick={() => navigate("/events")}
								className="group">
								Lihat Event
								<ArrowRight
									size={20}
									className="ml-2 group-hover:translate-x-1 transition-transform"
								/>
							</DynamicButton>
							<DynamicButton
								size="lg"
								variant="outline"
								onClick={() => navigate("/register")}>
								Buat Event
							</DynamicButton>
						</div>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, x: 50 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.8, delay: 0.2 }}
						exit={{ opacity: 0 }}
						className="relative">
						<div className="relative">
							<img
								src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=600&h=600&fit=crop"
								alt="Volunteer activities"
								className="rounded-2xl shadow-2xl"
							/>
							<div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-2xl" />
						</div>
					</motion.div>
				</div>
			</div>
		</section>
	);
}
