import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
} from "lucide-react";
import Button from "../ui/Button";
import Avatar from "../ui/Avatar";
import { useAuthStore } from "../../store";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();

  const navItems = [
    { name: "Beranda", href: "/", icon: Home },
    { name: "Event", href: "/events", icon: Calendar },
    { name: "Organisasi", href: "/organizations", icon: Building },
  ];

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate("/");
  };

  return (
    <header className="w-full sticky top-0 z-40 bg-white/90 backdrop-blur-lg border-b border-gray-200/50 shadow-sm">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 max-w-7xl mx-auto">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl group-hover:scale-110 transition-transform duration-300">
              <Heart className="text-white" size={20} />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              VolunteerHub
            </span>
          </Link>

          {/* Desktop Navigation - Centered */}
          <nav className="hidden md:flex items-center space-x-8 flex-1 justify-center">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-gray-700 hover:text-blue-600 transition-all duration-200 flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-blue-50 group"
              >
                <item.icon
                  size={18}
                  className="group-hover:scale-110 transition-transform duration-200"
                />
                <span className="font-medium">{item.name}</span>
              </Link>
            ))}
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 p-2 rounded-xl hover:bg-blue-50 transition-colors"
                >
                  <Avatar src={user?.avatar} fallback={user?.name} size="sm" />
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-56 bg-white/90 backdrop-blur-lg border border-gray-200/50 rounded-2xl shadow-xl py-2"
                    >
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors rounded-lg mx-2"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <User size={18} className="mr-3" />
                        <span className="font-medium">Profile</span>
                      </Link>
                      <Link
                        to="/my-registrations"
                        className="flex items-center px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors rounded-lg mx-2"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Calendar size={18} className="mr-3" />
                        <span className="font-medium">Pendaftaran Saya</span>
                      </Link>
                      {user?.role === "organizer" && (
                        <Link
                          to="/dashboard"
                          className="flex items-center px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors rounded-lg mx-2"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <Settings size={18} className="mr-3" />
                          <span className="font-medium">Dashboard</span>
                        </Link>
                      )}
                      <hr className="my-2 border-gray-100" />
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-3 text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors rounded-lg mx-2"
                      >
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
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/login")}
                >
                  <LogIn size={16} className="mr-1" />
                  Masuk
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate("/register")}
                >
                  <UserPlus size={16} className="mr-1" />
                  Daftar
                </Button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-gray-600 hover:text-gray-900"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden py-4 border-t border-gray-200"
            >
              <nav className="space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="flex items-center space-x-2 px-2 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <item.icon size={18} />
                    <span>{item.name}</span>
                  </Link>
                ))}

                {!isAuthenticated && (
                  <>
                    <hr className="border-gray-200" />
                    <Link
                      to="/login"
                      className="flex items-center space-x-2 px-2 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <LogIn size={18} />
                      <span>Masuk</span>
                    </Link>
                    <Link
                      to="/register"
                      className="flex items-center space-x-2 px-2 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <UserPlus size={18} />
                      <span>Daftar</span>
                    </Link>
                  </>
                )}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;
