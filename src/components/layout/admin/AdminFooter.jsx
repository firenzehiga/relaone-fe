import { Heart } from "lucide-react";
import { Link } from "react-router-dom";

export default function AdminFooter() {
	const currentYear = new Date().getFullYear();

	return (
		<footer className="bg-slate-100 border-t w-full border-gray-200 py-4 px-4 sm:px-6">
			<div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-2 text-sm text-gray-600">
				<div className="flex items-center gap-1 text-center sm:text-left">
					<span>Made with</span>
					<Heart size={14} className="text-red-500 fill-red-500 mx-1" />
					<span>by RelaOne</span>
				</div>

				<div className="flex flex-wrap items-center gap-3 justify-center sm:justify-end text-center mt-2 sm:mt-0">
					<Link to="/privacy-policy" className="hover:text-blue-600 transition-colors">
						Privacy Policy
					</Link>
					<span className="hidden sm:inline text-gray-300">|</span>
					<Link to="/terms-of-service" className="hover:text-blue-600 transition-colors">
						Terms of Service
					</Link>
					<span className="hidden sm:inline text-gray-300">|</span>
					<span>{currentYear} RelaOne Panel</span>
				</div>
			</div>
		</footer>
	);
}
