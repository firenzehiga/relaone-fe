export function FetchLoader() {
	return (
		<div className="flex items-center justify-center py-2 mb-4 bg-emerald-50 border border-emerald-200 rounded-lg">
			<div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mr-2"></div>
			<span className="text-emerald-700 text-sm">
				Mengambil Data Terbaru...
			</span>
		</div>
	);
}

export default FetchLoader;
