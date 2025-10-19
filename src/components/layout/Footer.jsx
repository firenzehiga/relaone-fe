import {
	Heart,
	Mail,
	Phone,
	MapPin,
	Facebook,
	Instagram,
	Twitter,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
	const currentYear = new Date().getFullYear();

	return (
		<footer className="w-full bg-gray-900 border-t border-gray-800">
			<div className="w-full px-4 sm:px-6 lg:px-8 py-12">
				<div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-7xl mx-auto">
					{/* Brand */}
					<div className="col-span-1 md:col-span-2">
						<div className="flex items-center space-x-2 mb-4">
							<Heart className="text-emerald-500" size={28} />
							<span className="text-xl font-bold text-white">RelaOne</span>
						</div>
						<p className="text-gray-400 mb-4 max-w-md">
							Platform yang menghubungkan para volunteer dengan organisasi untuk
							berbagai kegiatan sosial yang bermanfaat bagi masyarakat.
						</p>
						<div className="flex space-x-4">
							<a
								href="#"
								className="text-gray-400 hover:text-emerald-400 transition-colors">
								<Facebook size={20} />
							</a>
							<a
								href="#"
								className="text-gray-400 hover:text-emerald-400 transition-colors">
								<Instagram size={20} />
							</a>
							<a
								href="#"
								className="text-gray-400 hover:text-emerald-400 transition-colors">
								<Twitter size={20} />
							</a>
						</div>
					</div>

					{/* Quick Links */}
					<div>
						<h3 className="text-white font-semibold mb-4">Menu</h3>
						<ul className="space-y-2">
							<li>
								<Link
									to="/"
									className="text-gray-400 hover:text-white transition-colors">
									Beranda
								</Link>
							</li>
							<li>
								<Link
									to="/events"
									className="text-gray-400 hover:text-white transition-colors">
									Event
								</Link>
							</li>
							<li>
								<Link
									to="/organizations"
									className="text-gray-400 hover:text-white transition-colors">
									Organisasi
								</Link>
							</li>
							<li>
								<Link
									to="/about"
									className="text-gray-400 hover:text-white transition-colors">
									Tentang Kami
								</Link>
							</li>
						</ul>
					</div>

					{/* Contact */}
					<div>
						<h3 className="text-white font-semibold mb-4">Kontak</h3>
						<ul className="space-y-2">
							<li className="flex items-center text-gray-400">
								<Mail size={16} className="mr-2" />
								<span>info@relaone.id</span>
							</li>
							<li className="flex items-center text-gray-400">
								<Phone size={16} className="mr-2" />
								<span>+62 858 9431 0722</span>
							</li>
							<li className="flex items-center text-gray-400">
								<MapPin size={16} className="mr-2" />
								<span>Depok, Indonesia</span>
							</li>
						</ul>
					</div>
				</div>

				{/* Bottom */}
				<div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto">
					<p className="text-gray-400 text-sm">
						© {currentYear} RelaOne. Semua hak dilindungi.
					</p>
					<div className="flex space-x-6 mt-4 md:mt-0">
						<Link
							to="/privacy"
							className="text-gray-400 hover:text-white text-sm transition-colors">
							Kebijakan Privasi
						</Link>
						<Link
							to="/terms"
							className="text-gray-400 hover:text-white text-sm transition-colors">
							Syarat & Ketentuan
						</Link>
					</div>
				</div>
			</div>
		</footer>
	);
}
