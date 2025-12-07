import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import DynamicButton from "@/components/ui/Button";

export default function VideoShowcase() {
	const navigate = useNavigate();
	const videoSrc = "/videos/footage.mp4";

	return (
		<section className="w-full py-20 bg-white">
			<div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
						<div>
							<h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
								Lihat Kegiatan Kami
							</h2>
							<p className="text-xl text-gray-600 mb-6">
								Tonton cuplikan kegiatan para relawan untuk mendapatkan gambaran bagaimana acara
								berjalan dan peran yang dapat Anda ambil.
							</p>

							<div className="flex flex-col sm:flex-row gap-4">
								<DynamicButton variant="success" onClick={() => navigate("/events")}>
									Jelajahi Event
								</DynamicButton>
								<DynamicButton
									variant="outline"
									onClick={() => {
										// buka video penuh di tab baru
										const w = window.open(videoSrc, "_blank");
										if (w) w.focus();
									}}>
									Lihat Video Penuh
								</DynamicButton>
							</div>
						</div>

						<div className="w-full">
							<div className="relative rounded-lg overflow-hidden shadow-lg">
								<video
									src={videoSrc}
									className="w-full h-64 md:h-80 object-cover"
									controls
									muted
									loop
									playsInline
								/>
							</div>
						</div>
					</div>
				</motion.div>
			</div>
		</section>
	);
}
