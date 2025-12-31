import { useEffect, useState } from "react";
import Carousel from "@/components/ui/Carousel";
import { useFeedbacks } from "@/_hooks/useFeedbacks";

export default function TestimonialSection() {
	const { data: feedbacks = [], isLoading: feedbacksLoading } = useFeedbacks();
	const featuredFeedbacks =
		feedbacks?.filter((f) => f.rating === 4 || f.rating === 5).slice(0, 3) || [];
	const [current, setCurrent] = useState(0);

	useEffect(() => {
		if (featuredFeedbacks.length === 0) return;
		const interval = setInterval(() => {
			setCurrent((prev) => (prev + 1) % featuredFeedbacks.length);
		}, 5000);
		return () => clearInterval(interval);
	}, [featuredFeedbacks]);

	return (
		<div className="mt-10 relative w-full overflow-hidden py-4">
			<div className="mt-10 relative w-full py-4">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
						<div className="flex flex-col justify-center">
							<h3 className="text-3xl font-bold text-gray-900 mb-4">
								{`Pengalaman Mereka Mengikuti Event Di Rela`}
								<span className="text-3xl font-bold text-emerald-600">O</span>ne
							</h3>
							<p className="text-gray-700 mb-4">{`Cerita nyata dari relawan yang telah mengikuti event di RelaOne.`}</p>
							<ul className="list-disc pl-5 space-y-2 text-gray-600">
								<li>RelaOne membantu relawan menemukan event yang sesuai passion mereka.</li>
								<li>Organisasi lebih mudah mengelola peserta dan komunikasi acara.</li>
								<li>Setiap partisipasi memberikan dampak nyata bagi komunitas.</li>
							</ul>
						</div>

						<div className="w-full flex items-center justify-center">
							{feedbacksLoading && (
								<div className="w-[520px] h-72 bg-gray-200 rounded-lg animate-pulse" />
							)}

							{!feedbacksLoading && featuredFeedbacks.length > 0 && (
								<div className="w-full flex justify-center">
									<Carousel
										items={featuredFeedbacks.map((f) => ({
											id: f.id,
											nama: f.user?.nama || "Anonymous",
											judul: f.event?.judul,
											rating: f.rating,
											komentar: f.komentar || "-",
										}))}
										baseWidth={500}
										autoplay={true}
										autoplayDelay={3000}
										pauseOnHover={true}
										loop={true}
										round={false}
									/>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
