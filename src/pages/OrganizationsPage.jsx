import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// UI Libraries
import { motion } from "framer-motion";
import { Building2, Search } from "lucide-react";

// Hooks
import { useOrganizations } from "@/_hooks/useOrganizations";
import { useDocumentTitle } from "@/_hooks/utils/useDocumentTitle";
import { useInView } from "react-intersection-observer";

// UI Components
import DynamicButton from "@/components/ui/Button";
import Skeleton from "@/components/ui/Skeleton";
import Card from "@/components/ui/Card";
import OrganizationCard from "@/components/OrganizationCard";
import { useDebounce } from "@/_hooks/utils/useDebounce";

export default function OrganizationsPage() {
	useDocumentTitle("Organizations Page");
	const navigate = useNavigate();

	const [searchTerm, setSearchTerm] = useState("");
	const debouncedSearch = useDebounce(searchTerm, 500);

	const { organizations, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage } =
		useOrganizations(1, 10, "verified", debouncedSearch);

	const { ref, inView } = useInView({ threshold: 0 });

	useEffect(() => {
		if (inView && hasNextPage && !isFetchingNextPage) {
			fetchNextPage();
		}
	}, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

	const filteredOrganizations = organizations;

	if (error) {
		return (
			<div className=" min-h-screen py-8 bg-gradient-to-br from-emerald-50 via-white to-teal-50">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center py-12">
						<div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
							<Building2 className="w-8 h-8 text-red-600" />
						</div>
						<h2 className="text-2xl font-bold text-red-600 mb-4">Gagal Memuat Organisasi</h2>
						<p className="text-gray-600 mb-6">
							{error.message || "Terjadi kesalahan saat mengambil data organisasi."}
						</p>
						<DynamicButton onClick={() => window.location.reload()} variant="primary">
							Coba Lagi
						</DynamicButton>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="page-transition min-h-screen py-8 bg-gradient-to-br from-blue-50 via-green-50 to-purple-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Hero Header */}
				<div className="mb-8 text-center">
					<h1 className="text-4xl lg:text-5xl font-bold  text-emerald-600 mb-4">
						Organisasi Penyelenggara
					</h1>
					<p className="text-xl text-gray-600 max-w-2xl mx-auto">
						Bergabunglah dengan berbagai organisasi yang berkontribusi untuk membuat perubahan
						positif di masyarakat
					</p>
				</div>

				{/* Search Bar */}
				<div className="mb-8">
					<Card className="p-4">
						<div className="relative">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
							<input
								type="text"
								placeholder="Cari organisasi, lokasi, atau kata kunci..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								disabled={isLoading}
								className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
							/>
						</div>
					</Card>
				</div>

				{/* Organizations List */}
				{isLoading ? (
					<Skeleton.OrgSkeleton rows={3} />
				) : filteredOrganizations.length === 0 ? (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						className="text-center py-12">
						<div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
							<Search className="w-8 h-8 text-gray-400" />
						</div>
						<h3 className="text-xl font-semibold text-gray-900 mb-2">
							Tidak ada organisasi ditemukan
						</h3>
						<p className="text-gray-600">Coba ubah kata kunci pencarian Anda</p>
					</motion.div>
				) : (
					<>
						<div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
							{filteredOrganizations.map((org, index) => (
								<motion.div
									key={org.id}
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.5, delay: index * 0.05 }}
									className="cursor-pointer">
									<OrganizationCard
										organization={org}
										onClick={(id) => navigate(`/organizations/details/${id}`)}
									/>
								</motion.div>
							))}
						</div>

						{/* <div className="mt-6 text-center">
							{hasNextPage ? (
								<button
									onClick={() => fetchNextPage()}
									disabled={isFetchingNextPage}
									className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50">
									{isFetchingNextPage ? "Memuat..." : "Muat lebih banyak"}
								</button>
							) : (
								<p className="text-gray-500">Tidak ada lagi organisasi</p>
							)}
						</div> */}
						{/* sentinel: ketika terlihat akan otomatis fetchNextPage */}
						<div ref={ref} className="h-8 flex items-center justify-center mt-6 text-emerald-600">
							{isFetchingNextPage
								? "Memuat..."
								: hasNextPage
								? "Scroll untuk memuat lebih"
								: "Tidak ada data lagi"}
						</div>
					</>
				)}
			</div>
		</div>
	);
}
