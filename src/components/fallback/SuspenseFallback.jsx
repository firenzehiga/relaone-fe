export default function SuspenseFallback() {
	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
			{/* Main Content */}
			<div className="flex flex-col items-center justify-center space-y-5">
				{/* Logo Container */}
				<div className="relative">
					{/* Logo */}
					<div className="relative bg-white rounded-xl p-4 shadow-lg border border-gray-100">
						<img src="/images/logo_fe.png" alt="Logo" className="w-16 h-16 object-contain" />
					</div>
				</div>

				{/* Minimal Progress Dots */}
				<div className="flex space-x-1.5">
					<div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></div>
					<div
						className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"
						style={{ animationDelay: "0.1s" }}></div>
					<div
						className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce"
						style={{ animationDelay: "0.2s" }}></div>
				</div>
			</div>
		</div>
	);
}
