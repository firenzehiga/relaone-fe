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
	Settings,
	LogOut,
	Users,
	MapPin,
	User2,
	ShieldCheck,
} from "lucide-react";
import Button from "@/components/ui/Button";
import Avatar from "@/components/ui/Avatar";
import { useAuthStore, useLogout } from "@/_hooks/useAuth";

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
		{ name: "Beranda", href: "/home", icon: Home },
		{ name: "Event", href: "/events", icon: Calendar },
		{ name: "Organisasi", href: "/organizations", icon: Building },
	];

	const adminNav = [
		{ name: "Dashboard", href: "/admin/dashboard", icon: Home },
		{ name: "Users", href: "/admin/users", icon: User2 },
		{ name: "Organizations", href: "/admin/organizations", icon: Building },
		{ name: "Events", href: "/admin/events", icon: Calendar },
		{
			name: "Participants",
			href: "/admin/event-participants",
			icon: Users,
		},
		{ name: "Feedbacks", href: "/admin/feedbacks", icon: Heart },
		{ name: "Locations", href: "/admin/locations", icon: MapPin },
	];
	const orgNav = [
		{
			name: "Dashboard",
			href: "/organization/dashboard",
			icon: Building,
		},
		{
			name: "Event",
			href: "/organization/events",
			icon: Calendar,
		},
		{
			name: "Event Participant",
			href: "/organization/event-participants",
			icon: Users,
		},
		{
			name: "Feedback",
			href: "/organization/feedbacks",
			icon: Users,
		},
		{
			name: "Location",
			href: "/organization/locations",
			icon: MapPin,
		},
	];
	const volunteerNav = []; // volunteers use baseNav

	let navItems = baseNav;

	// Show only role-specific menu for admin and organization
	// Guard by `isAuthenticated` so stale `user` data (from localStorage)
	// doesn't affect the navigation when token is missing/expired.
	if (isAuthenticated && user?.role === "admin") navItems = adminNav;
	else if (isAuthenticated && user?.role === "organization") navItems = orgNav;
	else if (isAuthenticated && user?.role === "volunteer") navItems = baseNav;

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
					<Link to="/home" className="flex items-center space-x-2 group">
						<div className="p-2 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl group-hover:scale-110 transition-transform duration-300">
							{user?.role === "admin" ? (
								<ShieldCheck className="text-white" size={20} />
							) : user?.role === "organization" ? (
								<Building className="text-white" size={20} />
							) : (
								<Heart className="text-white" size={20} />
							)}
						</div>
						<span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-600 bg-clip-text text-transparent">
							RelaOne
						</span>
					</Link>

					{/* Desktop Navigation - Centered */}
					<nav className="hidden md:flex items-center space-x-4 flex-1 justify-center">
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
									<Avatar src={user?.avatar} fallback={user?.nama} size="sm" />
								</button>

								<AnimatePresence>
									{userMenuOpen && (
										<motion.div
											initial={{ opacity: 0, y: -10 }}
											animate={{ opacity: 1, y: 0 }}
											exit={{ opacity: 0, y: -10 }}
											className="absolute right-0 mt-2 w-56 bg-white/90 backdrop-blur-lg border border-gray-200/50 rounded-2xl shadow-xl py-2">
											<Link
												to="/profile"
												className="flex items-center px-4 py-3 text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 transition-colors rounded-lg mx-2"
												onClick={() => setUserMenuOpen(false)}>
												<User size={18} className="mr-3" />
												<span className="font-medium">Profile</span>
											</Link>
											{user?.role === "volunteer" && (
												<Link
													to="/my-registrations"
													className="flex items-center px-4 py-3 text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 transition-colors rounded-lg mx-2"
													onClick={() => setUserMenuOpen(false)}>
													<Calendar size={18} className="mr-3" />
													<span className="font-medium">Pendaftaran Saya</span>
												</Link>
											)}
											<hr className="my-2 border-gray-100" />
											<button
												onClick={handleLogout}
												className="flex items-center w-full px-4 py-3 text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors rounded-lg mx-2">
												<LogOut size={18} className="mr-3" />
												Logout
											</button>
										</motion.div>
									)}
								</AnimatePresence>
							</div>
						) : (
							<div className="hidden md:flex items-center space-x-2">
								<Button
									variant="success"
									size="sm"
									onClick={() => navigate("/login")}>
									<LogIn size={16} className="mr-1" />
									Masuk
								</Button>
							</div>
						)}

						{/* Mobile Menu Button */}
						<button
							onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
							className="md:hidden text-gray-600 hover:text-gray-900">
							{mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
						</button>
					</div>
				</div>

				{/* Mobile Menu */}
				<AnimatePresence>
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
							className="md:hidden origin-top overflow-hidden border-t border-gray-200"
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
														className={
															active ? "text-emerald-600" : "text-gray-500"
														}
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
													className="flex items-center space-x-3 px-3 py-3 text-white bg-gradient-to-r from-emerald-500 to-orange-600 hover:from-emerald-600 hover:to-orange-700 rounded-lg transition-colors duration-200 mt-2"
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
