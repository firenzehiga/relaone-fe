import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
	Heart,
	Menu,
	X,
	Home,
	Calendar,
	Building,
	User,
	LogIn,
	UserPlus,
	LogOut,
	Users,
	MapPin,
	Info,
} from "lucide-react";
import DynamicButton from "@/components/ui/DynamicButton";
import Avatar from "@/components/ui/Avatar";
import { useAuthStore, useLogout } from "@/_hooks/useAuth";
import { getImageUrl } from "@/utils";

/**
 * Komponen Header navigasi utama aplikasi
 * Menampilkan logo, menu navigasi, dan user authentication controls
 * Responsive dengan mobile menu dan user dropdown menu
 *
 * @returns {JSX.Element} Header navigasi dengan sticky positioning
 */
export default function Header() {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const [userMenuOpen, setUserMenuOpen] = useState(false);

	const navigate = useNavigate();
	const { user, isAuthenticated } = useAuthStore();
	const logoutMutation = useLogout();

	const baseNav = [
		{ name: "Home", href: "/", icon: Home },
		{ name: "Event", href: "/events", icon: Calendar },
		{ name: "Organization", href: "/organizations", icon: Building },
		{ name: "About Us", href: "/about-us", icon: Info },
	];

	const orgNav = [
		{
			name: "Dashboard",
			href: "/organization/dashboard",
			icon: Building,
		},
		{
			name: "Events",
			href: "/organization/events",
			icon: Calendar,
		},
		{
			name: "Event Participants",
			href: "/organization/event-participants",
			icon: Users,
		},
		{
			name: "Feedbacks",
			href: "/organization/feedbacks",
			icon: Users,
		},
		{
			name: "Locations",
			href: "/organization/locations",
			icon: MapPin,
		},
	];
	const volunteerNav = []; // volunteers use baseNav

	let navItems = baseNav;

	// Hanya tampilkan menu sesuai role user
	// Jangan tampilkan menu jika user belum login.
	// Jika verifikasi organisasi masih "pending", hanya tampilkan Dashboard.
	if (isAuthenticated && user?.role === "organization") {
		// mengecek status verifikasi organisasi dari authUser di local storage
		const orgStatus = user?.organization?.status_verifikasi;
		if (orgStatus !== "verified") {
			navItems = [
				{
					name: "Dashboard",
					href: "/organization/dashboard",
					icon: Building,
				},
			];
		} else {
			navItems = orgNav;
		}
	} else if (isAuthenticated && user?.role === "volunteer") navItems = baseNav;
	/**
	 * Handler untuk logout user
	 * Memanggil store logout, menutup user menu, dan redirect ke home
	 */
	const handleLogout = () => {
		logoutMutation.mutate();
		setUserMenuOpen(false);
	};

	const location = useLocation();
	const isActive = (path) => {
		return location.pathname === path;
	};

	return (
		<header className="w-full sticky top-0 z-40 bg-white/90 backdrop-blur-lg border-b border-gray-200/50 shadow-sm">
			<div className="w-full px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between h-16 max-w-7xl mx-auto">
					{/* Logo */}
					<Link to="/" className="flex items-center space-x-2 group">
						<div className="p-1 group-hover:scale-110 transition-transform duration-300">
							<img src="/images/logo_fe.png" alt="RelaOne Logo" className="w-10 h-10" />
						</div>
						<span className="text-xl font-bold bg-black bg-clip-text text-transparent">
							Rela
							<span className="text-xl font-bold bg-emerald-600 bg-clip-text text-transparent">
								O
							</span>
							ne.
						</span>
					</Link>

					{/* Desktop Navigation - Centered */}
					<nav className="hidden lg:flex items-center space-x-4 flex-1 justify-center">
						{navItems.map((item) => {
							const active = isActive(item.href);
							return (
								<Link
									key={item.name}
									to={item.href}
									className={`transition-all duration-200 flex items-center space-x-2 px-3 py-2 rounded-lg group ${
										active
											? "text-emerald-600 bg-emerald-50 font-semibold"
											: "text-gray-700 hover:text-emerald-600 hover:bg-emerald-50"
									}`}>
									<item.icon
										size={16}
										className={`group-hover:scale-110 transition-transform duration-200 ${
											active ? "text-emerald-600" : ""
										}`}
									/>
									<span className="font-medium">{item.name}</span>
								</Link>
							);
						})}
					</nav>

					{/* User Actions */}
					<div className="flex items-center space-x-4">
						{/* User Menu */}
						{isAuthenticated ? (
							<div className="relative">
								<button
									onClick={() => setUserMenuOpen(!userMenuOpen)}
									className="flex items-center space-x-2 p-2 rounded-xl hover:bg-emerald-50 transition-colors">
									<Avatar
										src={user?.foto_profil ? getImageUrl(`foto_profil/${user?.foto_profil}`) : null}
										fallback={user?.nama}
										size="sm"
									/>
								</button>

								<AnimatePresence mode="wait">
									{userMenuOpen && (
										<motion.div
											initial={{ opacity: 0, y: -10 }}
											animate={{ opacity: 1, y: 0 }}
											exit={{ opacity: 0, y: -10 }}
											className="absolute right-0 mt-2 w-56 bg-white backdrop-blur-lg border border-gray-200/50 rounded-2xl shadow-xl">
											{user?.role === "volunteer" ? (
												<>
													<Link
														to="/volunteer/profile"
														className="flex items-center px-4 py-3 text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 transition-colors rounded-t-xl"
														onClick={() => setUserMenuOpen(false)}>
														<User size={18} className="mr-3" />
														<span className="font-medium">Profile</span>
													</Link>
													<Link
														to="/volunteer/my-activities"
														className="flex items-center px-4 py-3 text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 transition-colors rounded-lg"
														onClick={() => setUserMenuOpen(false)}>
														<Calendar size={18} className="mr-3" />
														<span className="font-medium">Riwayat Aktivitas</span>
													</Link>
												</>
											) : (
												<Link
													to="/organization/profile"
													className="flex items-center px-4 py-3 text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 transition-colors rounded-t-xl"
													onClick={() => setUserMenuOpen(false)}>
													<User size={18} className="mr-3" />
													<span className="font-medium">Profile</span>
												</Link>
											)}

											<hr className=" border-gray-100" />
											<button
												onClick={handleLogout}
												className="flex items-center w-full px-4 py-3 text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors rounded-b-xl ">
												<LogOut size={18} className="mr-3" />
												Logout
											</button>
										</motion.div>
									)}
								</AnimatePresence>
							</div>
						) : (
							<div className="hidden lg:flex items-center space-x-2">
								<DynamicButton variant="success" size="sm" onClick={() => navigate("/login")}>
									<LogIn size={16} className="mr-1" />
									Masuk
								</DynamicButton>
							</div>
						)}

						{/* Mobile Menu Button */}
						<button
							onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
							className="lg:hidden text-gray-600 hover:text-gray-900">
							{mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
						</button>
					</div>
				</div>

				{/* Mobile Menu */}
				<AnimatePresence mode="wait">
					{mobileMenuOpen && (
						<motion.div
							initial={{ opacity: 0, scaleY: 0 }}
							animate={{ opacity: 1, scaleY: 1 }}
							exit={{ opacity: 0, scaleY: 0 }}
							transition={{
								duration: 0.2,
								ease: "easeInOut",
								opacity: { duration: 0.15 },
								scaleY: { duration: 0.2 },
							}}
							className="lg:hidden origin-top overflow-hidden border-t border-gray-200"
							style={{ transformOrigin: "top" }}>
							<div className="py-4 px-2">
								<nav className="space-y-1">
									{navItems.map((item, index) => {
										const active = isActive(item.href);
										return (
											<motion.div
												key={item.name}
												initial={{ opacity: 0, x: -20 }}
												animate={{ opacity: 1, x: 0 }}
												transition={{ delay: index * 0.05, duration: 0.2 }}>
												<Link
													to={item.href}
													className={`flex items-center space-x-3 px-3 py-3 rounded-lg transition-colors duration-200 ${
														active
															? "text-emerald-600 bg-emerald-50 font-semibold"
															: "text-gray-700 hover:text-emerald-600 hover:bg-emerald-50"
													}`}
													onClick={() => setMobileMenuOpen(false)}>
													<item.icon
														size={20}
														className={active ? "text-emerald-600" : "text-gray-500"}
													/>
													<span className="font-medium">{item.name}</span>
												</Link>
											</motion.div>
										);
									})}

									{!isAuthenticated && (
										<>
											<hr className="my-3 border-gray-200" />
											<motion.div
												initial={{ opacity: 0, x: -20 }}
												animate={{ opacity: 1, x: 0 }}
												transition={{
													delay: navItems.length * 0.05,
													duration: 0.2,
												}}>
												<Link
													to="/login"
													className="flex items-center space-x-3 px-3 py-3 text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors duration-200"
													onClick={() => setMobileMenuOpen(false)}>
													<LogIn size={20} className="text-gray-500" />
													<span className="font-medium">Masuk</span>
												</Link>
											</motion.div>
											<motion.div
												initial={{ opacity: 0, x: -20 }}
												animate={{ opacity: 1, x: 0 }}
												transition={{
													delay: (navItems.length + 1) * 0.05,
													duration: 0.2,
												}}>
												<Link
													to="/register"
													className="flex items-center space-x-3 px-3 py-3 text-white bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 rounded-lg transition-colors duration-200 mt-2"
													onClick={() => setMobileMenuOpen(false)}>
													<UserPlus size={20} />
													<span className="font-medium">Daftar</span>
												</Link>
											</motion.div>
										</>
									)}
								</nav>
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</header>
	);
}
