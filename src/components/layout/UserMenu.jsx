import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { User, LogOut, Settings, ChevronDown } from "lucide-react";
import Avatar from "@/components/ui/Avatar";
import { useAuthStore, useLogout } from "@/_hooks/useAuth";
import { getImageUrl } from "@/utils";

export function UserMenu() {
	const [userMenuOpen, setUserMenuOpen] = useState(false);
	const [dropdownPosition, setDropdownPosition] = useState({
		top: 0,
		right: 0,
	});
	const userMenuRef = useRef(null);
	const buttonRef = useRef(null);

	const { user } = useAuthStore();
	const logoutMutation = useLogout();

	const handleLogout = () => {
		logoutMutation.mutate();
		setUserMenuOpen(false);
	};

	// Calculate dropdown position based on button position
	const calculateDropdownPosition = () => {
		if (buttonRef.current) {
			const rect = buttonRef.current.getBoundingClientRect();
			setDropdownPosition({
				top: rect.bottom + 8,
				right: window.innerWidth - rect.right,
			});
		}
	};

	// Effect untuk menutup user menu ketika klik di luar
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
				setUserMenuOpen(false);
			}
		};

		const handleResize = () => {
			if (userMenuOpen) {
				calculateDropdownPosition();
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		window.addEventListener("resize", handleResize);

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
			window.removeEventListener("resize", handleResize);
		};
	}, [userMenuOpen]);

	const profilePath =
		user?.role === "admin" ? "/admin/profile" : "/organization/profile";

	const handleMenuToggle = () => {
		if (!userMenuOpen) {
			calculateDropdownPosition();
		}
		setUserMenuOpen(!userMenuOpen);
	};

	return (
		<div className="relative ml-auto" ref={userMenuRef}>
			<button
				ref={buttonRef}
				onClick={handleMenuToggle}
				className="flex items-center space-x-2 p-1.5 rounded-lg hover:bg-sidebar-accent transition-colors">
				<Avatar
					src={
						user?.foto_profil
							? getImageUrl(`foto_profil/${user.foto_profil}`)
							: null
					}
					alt={user?.name || "User"}
					fallback={user?.name?.charAt(0) || "U"}
					size="sm"
				/>
				<div className="hidden sm:flex flex-col text-left text-xs">
					<span className="font-medium text-sidebar-foreground truncate max-w-24">
						{user?.nama || "User"}
					</span>
					<span className="text-sidebar-muted-foreground truncate max-w-24">
						{user?.role === "admin" ? "Admin" : "Organization"}
					</span>
				</div>
				<ChevronDown className="h-3 w-3 text-sidebar-muted-foreground hidden sm:block" />
			</button>

			<AnimatePresence>
				{userMenuOpen && (
					<motion.div
						initial={{ opacity: 0, scale: 0.95 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 0.95 }}
						className="fixed w-56 bg-white border border-gray-200 rounded-lg shadow-xl z-[99999] user-menu-dropdown"
						style={{
							zIndex: 99999,
							position: "fixed",
							top: `${dropdownPosition.top}px`,
							right: `${dropdownPosition.right}px`,
						}}>
						<div className="p-3 border-b border-gray-100">
							<p className="text-sm font-medium text-gray-800">{user?.name}</p>
							<p className="text-xs text-gray-500">{user?.email}</p>
							{user?.organization && (
								<p className="text-xs text-emerald-600">
									{user.organization.nama_organisasi}
								</p>
							)}
						</div>

						<div className="p-2">
							<Link
								to={profilePath}
								className="flex items-center gap-3 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
								onClick={() => setUserMenuOpen(false)}>
								<User className="h-4 w-4" />
								<span>Profile</span>
							</Link>
						</div>

						<div className="p-2 border-t border-gray-100">
							<button
								onClick={handleLogout}
								className="flex items-center gap-3 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors">
								<LogOut className="h-4 w-4" />
								<span>Logout</span>
							</button>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
