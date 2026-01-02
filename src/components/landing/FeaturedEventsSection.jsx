import { motion } from "framer-motion";
import DynamicButton from "@/components/ui/DynamicButton";
import EventCard from "@/components/EventCard";
import Skeleton from "@/components/ui/Skeleton";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function FeaturedEventsSection({ eventsLoading, featuredEvents = [], onJoin }) {
	const navigate = useNavigate();

	return (
		<section className="w-full py-20 bg-gradient-to-br from-gray-50 to-emerald-50">
			<div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between mb-12">
					<div>
						<h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Kegiatan Terbaru</h2>
						<p className="text-xl text-gray-600">
							Kegiatan sosial yang sedang dibuka untuk pendaftaran
						</p>
					</div>
					<DynamicButton variant="outline" onClick={() => navigate("/events")}>
						Lihat Semua
						<ArrowRight size={16} className="ml-2" />
					</DynamicButton>
				</div>

				{eventsLoading ? (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{Array.from({ length: 3 }).map((_, i) => (
							<Skeleton.EventCard key={i} />
						))}
					</div>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{featuredEvents.map((event, index) => (
							<motion.div
								key={event.id}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0 }}
								transition={{ delay: index * 0.1 }}>
								<EventCard event={event} onJoin={onJoin} />
							</motion.div>
						))}
					</div>
				)}
			</div>
		</section>
	);
}
