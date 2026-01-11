import { motion } from "framer-motion";
import Button from "@/components/ui/DynamicButton";
import { useNavigate } from "react-router-dom";

export default function CTASection() {
	const navigate = useNavigate();

	return (
		<section className="w-full py-20 bg-gradient-to-r from-emerald-600 to-emerald-600">
			<div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
				<div>
					<h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
						Siap Memulai Perjalanan Volunteer Anda?
					</h2>
					<p className="text-xl text-emerald-100 mb-8 leading-relaxed">
						Bergabunglah dengan ribuan relawan lainnya dan mari bersama-sama membuat perubahan
						positif untuk masyarakat.
					</p>
					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<Button
							size="lg"
							variant="secondary"
							className="border-white text-black hover:bg-white hover:text-emerald-600"
							onClick={() => navigate("/events")}>
							Jelajahi Kegiatan
						</Button>
					</div>
				</div>
			</div>
		</section>
	);
}
