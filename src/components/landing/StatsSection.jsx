import { motion } from "framer-motion";
import CountUp from "@/components/ui/CountUp";

export default function StatsSection({
	stats = { totalEvents: 0, totalVolunteers: 0, totalOrganizations: 0 },
}) {
	const items = [
		{ label: "Kegiatan Dibuat ", value: stats.totalEvents, suffix: "+" },
		{ label: "Relawan Terdaftar", value: stats.totalVolunteers, suffix: "+" },
		{ label: "Organisasi Partner", value: stats.totalOrganizations, suffix: "+" },
	];

	return (
		<section className="w-full py-16 bg-gradient-to-r from-emerald-600 to-emerald-600">
			<div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
					{items.map((stat, index) => (
						<motion.div
							key={stat.label}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: index * 0.1 }}
							exit={{ opacity: 0 }}
							className="text-center group">
							<div className="text-4xl lg:text-5xl font-bold text-white mb-2 group-hover:scale-110 transition-transform duration-300">
								<CountUp from={0} to={stat.value} duration={1.2} separator="." className="inline" />
								<span className="ml-1 inline">{stat.suffix}</span>
							</div>
							<div className="text-emerald-100 font-medium">{stat.label}</div>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
}
