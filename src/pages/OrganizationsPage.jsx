import { useState } from "react";
import { useNavigate } from "react-router-dom";

// UI Libraries
import { motion } from "framer-motion";
import { AsyncImage } from "loadable-image";
import { Fade } from "transitions-kit";
import { Building2, MapPin, Mail, Phone, Globe, Star, CheckCircle, Search } from "lucide-react";

// Hooks
import { useOrganizations } from "@/_hooks/useOrganizations";
import { useDocumentTitle } from "@/_hooks/useDocumentTitle";

// Helpers
import { getImageUrl } from "@/utils";

// UI Components
import DynamicButton from "@/components/ui/Button";
import Skeleton from "@/components/ui/Skeleton";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import OrganizationCard from "@/components/OrganizationCard";

export default function OrganizationsPage() {
	useDocumentTitle("Organizations Page");
	const navigate = useNavigate();

	const { data: organizations = [], isLoading, error } = useOrganizations("verified");

	const [searchTerm, setSearchTerm] = useState("");

	// Filter organizations based on search
	const filteredOrganizations = organizations.filter(
		(org) =>
			org.nama?.toLowerCase().includes(searchTerm.toLowerCase()) ||
			org.kota?.toLowerCase().includes(searchTerm.toLowerCase()) ||
			org.deskripsi?.toLowerCase().includes(searchTerm.toLowerCase())
	);

	if (error) {
		return (
			<div className="page-transition min-h-screen py-8 bg-gradient-to-br from-emerald-50 via-white to-teal-50">
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

	if (isLoading) {
		return <Skeleton.OrgSkeleton />;
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
								className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
							/>
						</div>
					</Card>
				</div>

				{/* Organizations List */}
				{filteredOrganizations.length === 0 ? (
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
				)}
			</div>
		</div>
	);
}
