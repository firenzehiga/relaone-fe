import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useFeedbacks } from "@/_hooks/useFeedbacks";
import { useDocumentTitle } from "@/_hooks/utils/useDocumentTitle";

import DynamicButton from "@/components/ui/Button";
import Carousel from "@/components/ui/Carousel";
import Masonry from "@/components/ui/Masonry";

export default function AboutPage() {
	useDocumentTitle("Tentang RelaOne");

	const { data: feedbacks = [], isLoading: feedbacksLoading } = useFeedbacks();
	const navigate = useNavigate();

	const featuredFeedbacks =
		feedbacks?.filter((feedback) => feedback.rating === 4 || feedback.rating === 5).slice(0, 3) ||
		[];

	const [current, setCurrent] = useState(0);

	useEffect(() => {
		if (featuredFeedbacks.length === 0) return;

		const interval = setInterval(() => {
			setCurrent((prev) => (prev + 1) % featuredFeedbacks.length);
		}, 5000);

		return () => clearInterval(interval);
	}, [featuredFeedbacks]);

	const galleryItems = [
		{
			id: "gallery-1",
			img: "https://picsum.photos/id/1015/600/900?random=1",
			url: "https://example.com/gallery-1",
			height: 450,
			title: "Community Service",
		},
		{
			id: "gallery-2",
			img: "https://picsum.photos/id/1011/600/750?random=2",
			url: "https://example.com/gallery-2",
			height: 350,
			title: "Volunteer Work",
		},
		{
			id: "gallery-3",
			img: "https://picsum.photos/id/1020/600/800?random=3",
			url: "https://example.com/gallery-3",
			height: 500,
			title: "Social Impact",
		},
		{
			id: "gallery-4",
			img: "https://picsum.photos/id/1025/600/700?random=4",
			url: "https://example.com/gallery-4",
			height: 380,
			title: "Team Building",
		},
		{
			id: "gallery-5",
			img: "https://picsum.photos/id/1035/600/900?random=5",
			url: "https://example.com/gallery-5",
			height: 460,
			title: "Event Coverage",
		},
		{
			id: "gallery-6",
			img: "https://picsum.photos/id/1045/600/800?random=6",
			url: "https://example.com/gallery-6",
			height: 420,
			title: "Participant Stories",
		},
		{
			id: "gallery-7",
			img: "https://picsum.photos/id/1050/600/750?random=7",
			url: "https://example.com/gallery-7",
			height: 390,
			title: "Group Activities",
		},
		{
			id: "gallery-8",
			img: "https://picsum.photos/id/1055/600/850?random=8",
			url: "https://example.com/gallery-8",
			height: 470,
			title: "Outreach Programs",
		},
		{
			id: "gallery-9",
			img: "https://picsum.photos/id/1060/600/700?random=9",
			url: "https://example.com/gallery-9",
			height: 360,
			title: "Youth Engagement",
		},
		{
			id: "gallery-10",
			img: "https://picsum.photos/id/1065/600/900?random=10",
			url: "https://example.com/gallery-10",
			height: 480,
			title: "Environmental Care",
		},
		{
			id: "gallery-11",
			img: "https://picsum.photos/id/1070/600/800?random=11",
			url: "https://example.com/gallery-11",
			height: 440,
			title: "Education Support",
		},
		{
			id: "gallery-12",
			img: "https://picsum.photos/id/1075/600/750?random=12",
			url: "https://example.com/gallery-12",
			height: 400,
			title: "Health Initiatives",
		},
		{
			id: "gallery-13",
			img: "https://picsum.photos/id/1080/600/850?random=13",
			url: "https://example.com/gallery-13",
			height: 410,
			title: "Community Building",
		},
		{
			id: "gallery-14",
			img: "https://picsum.photos/id/437/600/900?random=14",
			url: "https://example.com/gallery-14",
			height: 320,
			title: "Charity Events",
		},
		{
			id: "gallery-15",
			img: "https://picsum.photos/id/90/600/900?random=15",

			height: 250,
			title: "Success Stories",
		},
	];
	return (
		<div className="page-transition min-h-screen py-8 bg-gradient-to-br from-blue-50 via-white to-purple-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Header */}
				<div className="mb-8 text-center">
					<h1 className="text-4xl lg:text-5xl font-bold text-emerald-600 mb-4">Tentang RelaOne</h1>
					<p className="text-xl text-gray-600 max-w-2xl mx-auto">
						Menghubungkan orang dengan kegiatan sosial yang bermakna
					</p>
				</div>

				{/* Card Area */}
				<div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg">
					<div className="flex flex-col lg:flex-row items-center justify-between gap-8 py-4">
						{/* Logo / Visual */}
						<div className="w-full lg:w-1/2 mb-6 lg:mb-0">
							<div className="flex flex-col items-center">
								<img
									src="/images/logo_fe.png"
									alt="RelaOne Logo"
									className="w-1/3 mb-5 mx-auto lg:w-1/2 transition-transform duration-300 hover:scale-105"
								/>
								<div className="text-5xl font-bold bg-black bg-clip-text text-transparent">
									Rela
									<span className="text-5xl font-bold text-emerald-600">O</span>
									ne.
								</div>
							</div>
						</div>

						{/* Description */}
						<div className="w-full lg:w-1/2 px-2 lg:px-6">
							<h2 className="text-3xl md:text-4xl font-bold mb-4">
								Connecting People with <br className="hidden md:inline" />
								Social Purpose
							</h2>
							<h5 className="text-black font-semibold text-lg mb-2">About RelaOne</h5>

							<p className="text-gray-600 leading-relaxed text-justify mb-4">
								RelaOne adalah platform yang dirancang untuk mempermudah organisasi dan relawan
								berkolaborasi pada kegiatan sosial. Dengan sistem terpusat, organisasi dapat
								mempublikasikan event dan mengelola peserta, sementara relawan dapat menemukan
								kegiatan yang sesuai dan mendaftar dengan mudah.
							</p>

							<p className="text-gray-600 leading-relaxed text-justify mb-4">
								Kami berfokus pada aksesibilitas, transparansi, dan efisiensi agar partisipasi
								sosial menjadi lebih mudah dan berdampak. Setiap kontribusi, sekecil apa pun, dapat
								membawa perubahan bagi komunitas.
							</p>

							<div className="mt-6 flex flex-wrap gap-3">
								<DynamicButton variant="success" onClick={() => navigate("/events")}>
									Jelajahi Kegiatan
								</DynamicButton>
								<DynamicButton variant="outline" onClick={() => navigate("/organizations")}>
									Lihat Organisasi
								</DynamicButton>
							</div>
						</div>
					</div>
				</div>

				{/* Gallery Section */}
				<div className="mt-16 mb-16">
					<div className="mb-10 text-center">
						<h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">Galeri Kegiatan</h2>
						<p className="text-gray-600 text-lg max-w-2xl mx-auto">
							Lihat momen-momen berharga dari berbagai kegiatan sosial yang telah kami selenggarakan
						</p>
					</div>

					<div className=" overflow-hidden">
						<div className="p-4 sm:p-8" style={{ minHeight: "700px" }}>
							<Masonry
								items={galleryItems}
								ease="power3.out"
								duration={0.6}
								stagger={0.05}
								animateFrom="bottom"
								scaleOnHover={true}
								hoverScale={0.95}
								blurToFocus={true}
								colorShiftOnHover={true}
								disableClick={true}
							/>
						</div>
					</div>
				</div>

				{/* Testimonial Carousel */}
				<div className="mt-10 relative w-full overflow-hidden py-4">
					{/* Testimonial area: text left, carousel right */}
					<div className="mt-10 relative w-full py-4">
						<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
								{/* Left: Text block (uses hook for copy) */}
								<div className="flex flex-col justify-center">
									<h3 className="text-3xl font-bold text-gray-900 mb-4">
										{`Pengalaman Mereka Mengikuti Event Di Rela`}
										<span className="text-3xl font-bold text-emerald-600">O</span>
										ne
									</h3>
									<p className="text-gray-700 mb-4">{`Cerita nyata dari relawan yang telah mengikuti event di RelaOne.`}</p>
									<ul className="list-disc pl-5 space-y-2 text-gray-600">
										<li>RelaOne membantu relawan menemukan event yang sesuai passion mereka.</li>
										<li>Organisasi lebih mudah mengelola peserta dan komunikasi acara.</li>
										<li>Setiap partisipasi memberikan dampak nyata bagi komunitas.</li>
									</ul>
								</div>

								{/* Right: Carousel */}
								<div className="w-full flex items-center justify-center">
									{/* Loading state for carousel */}
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
			</div>
		</div>
	);
}
