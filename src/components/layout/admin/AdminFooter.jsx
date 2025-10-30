import { Heart } from "lucide-react";

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
					<a href="#" className="hover:text-blue-600 transition-colors">
						Privacy Policy
					</a>
					<span className="text-gray-300">|</span>
					<a href="#" className="hover:text-blue-600 transition-colors">
						Terms of Service
					</a>
					<span className="text-gray-300">|</span>
					<span>{currentYear} RelaOne Panel</span>
				</div>
			</div>
		</footer>
	);
}
