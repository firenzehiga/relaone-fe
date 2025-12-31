import { motion } from "framer-motion";
import Card from "@/components/ui/Card";
import { Heart, Search, Users } from "lucide-react";

export default function FeaturesSection() {
	const features = [
		{
			icon: Search,
			title: "Temukan Kegiatan Sosial",
			description:
				"Cari dan ikuti berbagai kegiatan sosial yang sesuai dengan minat dan passion Anda.",
		},
		{
			icon: Users,
			title: "Bergabung Komunitas",
			description:
				"Bertemu dengan sesama relawan dan bangun jaringan untuk kegiatan sosial yang berkelanjutan.",
		},
		{
			icon: Heart,
			title: "Berbagi Kebaikan",
			description: "Kontribusi nyata untuk masyarakat dan rasakan kepuasan membantu sesama.",
		},
	];
	return (
		<section className="w-full py-20 bg-gradient-to-br from-gray-50 to-emerald-50">
			<div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="text-center mb-16">
					<h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
						Mengapa Memilih Rela
						<span className="text-emerald-600">O</span>ne?
					</h2>
					<p className="text-xl text-gray-600 max-w-3xl mx-auto">
						Platform terpercaya untuk menghubungkan relawan dengan kegiatan sosial yang bermakna
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
					{features.map((feature, index) => (
						<motion.div
							key={feature.title}
							// initial={{ opacity: 0, y: 20 }}
							// animate={{ opacity: 1, y: 0 }}
							// transition={{ delay: index * 0.1 }}
							// exit={{ opacity: 0 }}
							className="group">
							<Card className="text-center h-full group-hover:scale-105 transition-transform ease-out duration-300">
								<div className="mx-auto w-16 h-16 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
									<feature.icon className="text-white" size={28} />
								</div>
								<h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
								<p className="text-gray-600 leading-relaxed">{feature.description}</p>
							</Card>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
}
