import Masonry from "@/components/ui/Masonry";

export default function GallerySection() {
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
	);
}
