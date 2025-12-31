import { GraduationCap, Leaf, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Card from "../ui/Card";
export default function CategoriesSection({ categories }) {
	const navigate = useNavigate();

	const categoriesIcons = [
		{
			icon: GraduationCap,
		},
		{
			icon: Heart,
		},
		{
			icon: Leaf,
		},
	];

	return (
		<section className="w-full py-20 bg-white">
			<div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="text-center mb-16">
					<h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Kategori Kegiatan</h2>
					<p className="text-xl text-gray-600">
						Beragam jenis kegiatan sosial yang dapat Anda ikuti
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
					{categories.slice(0, 3).map((category, index) => {
						const Icon = categoriesIcons[index]?.icon;
						return (
							<motion.div
								key={category.id ?? index}
								className="cursor-pointer"
								onClick={() => navigate(`/events?category=${category.id}`)}>
								<Card className="text-center hover:scale-105 transition-transform ease-out duration-300">
									<div
										className={`mx-auto w-16 h-16  rounded-full flex items-center justify-center mb-6`}
										style={{ backgroundColor: `${category.warna}20` }}>
										{Icon ? <Icon style={{ color: category.warna }} size={32} /> : null}
									</div>
									<h3 className="text-xl font-semibold text-gray-500 mb-2">{category.nama}</h3>
									<p className="text-gray-400">{category.deskripsi}</p>
								</Card>
							</motion.div>
						);
					})}
				</div>
			</div>
		</section>
	);
}
