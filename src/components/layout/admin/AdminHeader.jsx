import { useState, useEffect, useRef } from "react";
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
	ChevronDown,
	SwatchBook,
} from "lucide-react";
import DynamicButton from "@/components/ui/Button";
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
export default function AdminHeader() {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const [desktopSubmenuOpen, setDesktopSubmenuOpen] = useState(null);
	const [mobileSubmenusOpen, setMobileSubmenusOpen] = useState({});
	const [userMenuOpen, setUserMenuOpen] = useState(false);

	// Refs untuk mendeteksi klik di luar
	const desktopSubmenuRef = useRef(null);
	const userMenuRef = useRef(null);

	const navigate = useNavigate();
	const { user, isAuthenticated } = useAuthStore();
	const logoutMutation = useLogout();

	const navItems = [
		{ name: "Dashboard", href: "/admin/dashboard", icon: Home },
		{ name: "Users", href: "/admin/users", icon: User2 },
		{ name: "Organizations", href: "/admin/organizations", icon: Building },
		{
			name: "Manage Events",
			href: "/admin/events",
			icon: Calendar,
			submenu: [
				{ name: "Events", href: "/admin/events", icon: Calendar },
				{
					name: "Participants",
					href: "/admin/event-participants",
					icon: Users,
				},
				{ name: "Locations", href: "/admin/locations", icon: MapPin },
				{ name: "Categories", href: "/admin/categories", icon: SwatchBook },
			],
		},
		{ name: "Feedbacks", href: "/admin/feedbacks", icon: Heart },
	];

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

	const toggleMobileSubmenu = (name) => {
		setMobileSubmenusOpen((s) => ({ ...s, [name]: !s[name] }));
	};

	// Effect untuk menutup submenu ketika klik di luar
	useEffect(() => {
		const handleClickOutside = (event) => {
			// Tutup desktop submenu jika klik di luar
			if (
				desktopSubmenuRef.current &&
				!desktopSubmenuRef.current.contains(event.target)
			) {
				setDesktopSubmenuOpen(null);
			}

			// Tutup user menu jika klik di luar
			if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
				setUserMenuOpen(false);
			}
		};

		// Tambahkan event listener
		document.addEventListener("mousedown", handleClickOutside);

		// Cleanup event listener
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	return (
		<header className="w-full sticky top-0 z-40 bg-white/90 backdrop-blur-lg border-b border-gray-200/50 shadow-sm">
			<div className="w-full px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between h-16 max-w-7xl mx-auto">
					{/* Logo */}
					<Link
						to="/admin/dashboard"
						className="flex items-center space-x-2 group">
						<img
							src="/images/logo_fe.png"
							alt="RelaOne Logo"
							className="w-10 h-10"
						/>
						<span className="text-xl font-bold bg-gradient-to-r from-gray-600 to-gray-600 bg-clip-text text-transparent">
							Admin
						</span>
						<span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-600 bg-clip-text text-transparent">
							RelaOne
						</span>
					</Link>

					{/* Desktop Navigation - Centered */}
					<nav className="hidden md:flex items-center space-x-4 flex-1 justify-center">
						{navItems.map((item) => {
							const active =
								isActive(item.href) ||
								(item.submenu && item.submenu.some((s) => isActive(s.href)));
							if (item.submenu) {
								return (
									<div
										key={item.name}
										ref={desktopSubmenuRef}
										className="relative"
										onMouseEnter={() => setDesktopSubmenuOpen(item.name)}
										onMouseLeave={() => setDesktopSubmenuOpen(null)}>
										<button
											className={`transition-all duration-200 flex items-center space-x-2 px-3 py-2 rounded-lg group ${
												active
													? "text-emerald-600 bg-emerald-50 font-semibold"
													: "text-gray-700 hover:text-emerald-600 hover:bg-emerald-50"
											}`}
											onClick={() =>
												setDesktopSubmenuOpen(
													desktopSubmenuOpen === item.name ? null : item.name
												)
											}
											aria-expanded={desktopSubmenuOpen === item.name}>
											<item.icon
												size={16}
												className={active ? "text-emerald-600" : ""}
											/>
											<span className="font-medium">{item.name}</span>
											<ChevronDown size={14} />
										</button>
										<AnimatePresence>
											{desktopSubmenuOpen === item.name && (
												<motion.div
													initial={{ opacity: 0, y: -6 }}
													animate={{ opacity: 1, y: 0 }}
													exit={{ opacity: 0, y: -6 }}
													className="absolute left-0 mt-2 w-44 bg-white border border-gray-100 rounded-lg shadow-lg z-50 overflow-hidden">
													{item.submenu.map((s) => (
														<Link
															key={s.href}
															to={s.href}
															className={`flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 ${
																isActive(s.href)
																	? "text-emerald-600 bg-emerald-50 font-semibold"
																	: ""
															}`}>
															<s.icon size={14} className="text-gray-500" />
															<span>{s.name}</span>
														</Link>
													))}
												</motion.div>
											)}
										</AnimatePresence>
									</div>
								);
							}
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
										className={active ? "text-emerald-600" : ""}
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
							<div className="relative" ref={userMenuRef}>
								<button
									onClick={() => setUserMenuOpen(!userMenuOpen)}
									className="flex items-center space-x-2 p-2 rounded-xl hover:bg-emerald-50 transition-colors">
									<Avatar
										src={getImageUrl(`foto_profil/${user?.foto_profil}`)}
										fallback={user?.nama}
										size="sm"
									/>
									<span className="text-sm font-medium text-gray-700 hidden sm:block">
										{user?.nama}
									</span>
									<ChevronDown
										size={16}
										className="text-gray-500 hidden sm:block"
									/>
								</button>

								<AnimatePresence>
									{userMenuOpen && (
										<motion.div
											initial={{ opacity: 0, y: -10 }}
											animate={{ opacity: 1, y: 0 }}
											exit={{ opacity: 0, y: -10 }}
											className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
											<div className="p-3 border-b border-gray-100">
												<p className="text-sm font-medium text-gray-800">
													{user?.nama}
												</p>
												<p className="text-xs text-gray-500">{user?.email}</p>
											</div>
											<div className="p-2">
												<Link
													to="/admin/profile"
													className="flex items-center gap-3 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors">
													<User size={16} />
													<span>Profile</span>
												</Link>
											</div>
											<div className="p-2 border-t border-gray-100">
												<button
													onClick={handleLogout}
													className="flex items-center gap-3 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors">
													<LogOut size={16} />
													<span>Logout</span>
												</button>
											</div>
										</motion.div>
									)}
								</AnimatePresence>
							</div>
						) : (
							<div className="hidden md:flex items-center space-x-2">
								<DynamicButton
									variant="success"
									size="sm"
									onClick={() => navigate("/login")}>
									<LogIn size={16} className="mr-1" />
									Masuk
								</DynamicButton>
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
										const active =
											isActive(item.href) ||
											(item.submenu &&
												item.submenu.some((s) => isActive(s.href)));
										if (item.submenu) {
											return (
												<motion.div
													key={item.name}
													initial={{ opacity: 0, x: -20 }}
													animate={{ opacity: 1, x: 0 }}
													transition={{ delay: index * 0.05, duration: 0.2 }}>
													<button
														className={`flex items-center justify-between w-full space-x-3 px-3 py-3 rounded-lg transition-colors duration-200 ${
															active
																? "text-emerald-600 bg-emerald-50 font-semibold"
																: "text-gray-700 hover:text-emerald-600 hover:bg-emerald-50"
														}`}
														onClick={() => toggleMobileSubmenu(item.name)}>
														<div className="flex items-center space-x-3">
															<item.icon
																size={20}
																className={
																	active ? "text-emerald-600" : "text-gray-500"
																}
															/>
															<span className="font-medium">{item.name}</span>
														</div>
														<ChevronDown size={18} />
													</button>
													{mobileSubmenusOpen[item.name] && (
														<div className="pl-6 pt-2 pb-2 space-y-1">
															{item.submenu.map((s) => (
																<Link
																	key={s.href}
																	to={s.href}
																	className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors duration-200 ${
																		isActive(s.href)
																			? "text-emerald-600 bg-emerald-50 font-semibold"
																			: "text-gray-700 hover:text-emerald-600 hover:bg-emerald-50"
																	}`}
																	onClick={() => setMobileMenuOpen(false)}>
																	<s.icon
																		size={18}
																		className={
																			isActive(s.href)
																				? "text-emerald-600"
																				: "text-gray-500"
																		}
																	/>
																	<span className="font-medium">{s.name}</span>
																</Link>
															))}
														</div>
													)}
												</motion.div>
											);
										}
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
