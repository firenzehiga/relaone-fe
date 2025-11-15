import { Heart } from "lucide-react";
import { Link } from "react-router-dom";

export default function AdminFooter() {
	const currentYear = new Date().getFullYear();

	return (
		<footer className="bg-slate-100 border-t bottom-0 w-full border-gray-200 py-4 px-6">
			<div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-gray-600">
				<div className="flex items-center gap-1">
					<span>Made with </span>
					<Heart size={14} className="text-red-500 fill-red-500" />
					<span>by RelaOne</span>
				</div>

				<div className="flex items-center gap-4">
					<Link to="/privacy-policy" className="hover:text-blue-600 transition-colors">
						Privacy Policy
					</Link>
					<span className="text-gray-300">|</span>
					<Link to="/terms-of-service" className="hover:text-blue-600 transition-colors">
						Terms of Service
					</Link>
					<span className="text-gray-300">|</span>
					<span>{currentYear} RelaOne Panel</span>
				</div>
			</div>
		</footer>
	);
}
