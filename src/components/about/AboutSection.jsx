import DynamicButton from "@/components/ui/Button";

export default function AboutSection({ navigate }) {
	return (
		<div className="mb-8">
			<div className="mb-8 text-center">
				<h1 className="text-4xl lg:text-5xl font-bold text-emerald-600 mb-4">Tentang RelaOne</h1>
				<p className="text-xl text-gray-600 max-w-2xl mx-auto">
					Menghubungkan orang dengan kegiatan sosial yang bermakna
				</p>
			</div>

			<div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg">
				<div className="flex flex-col lg:flex-row items-center justify-between gap-8 py-4">
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
							Kami berfokus pada aksesibilitas, transparansi, dan efisiensi agar partisipasi sosial
							menjadi lebih mudah dan berdampak. Setiap kontribusi, sekecil apa pun, dapat membawa
							perubahan bagi komunitas.
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
		</div>
	);
}
