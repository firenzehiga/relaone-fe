// UI Libraries
import { motion } from "framer-motion";
import { Shield } from "lucide-react";

// Hooks
import { useUserProfile } from "@/_hooks/useUsers";
import { useDocumentTitle } from "@/_hooks/utils/useDocumentTitle";

// UI Components
import Skeleton from "@/components/ui/Skeleton";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import ProfileDetails from "@/components/common/ProfileDetails";
import ProfileCard from "@/components/common/ProfileCard";

/**
 * Halaman Profile Organization
 * Menampilkan informasi lengkap profile organization yang sedang login
 */

export default function OrganizationProfilePage() {
	useDocumentTitle("Profile Page");

	const { data: profile, isLoading, error, refetch } = useUserProfile();

	if (isLoading) {
		return <Skeleton.ProfileSkeleton />;
	}

	if (error) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
				<Card className="max-w-md text-center">
					<div className="text-red-500 mb-4">
						<Shield className="w-16 h-16 mx-auto mb-4" />
					</div>
					<h2 className="text-xl font-bold text-gray-900 mb-2">Gagal Memuat Profile</h2>
					<p className="text-gray-600 mb-4">Terjadi kesalahan saat memuat data profile</p>
					<Button onClick={() => refetch()} variant="success">
						Coba Lagi
					</Button>
				</Card>
			</div>
		);
	}

	const containerVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				duration: 0.6,
				staggerChildren: 0.1,
			},
		},
	};

	const itemVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: { opacity: 1, y: 0 },
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-4 px-4">
			<motion.div
				className="max-w-7xl mx-auto"
				variants={containerVariants}
				initial="hidden"
				animate="visible">
				{/* Header Section - Compact */}
				<motion.div variants={itemVariants} className="text-center mb-6">
					<h1 className="text-2xl font-bold text-gray-900 mb-1">Profile Organisasi</h1>
					<p className="text-gray-600 text-sm">Kelola informasi profile organisasi Anda</p>
				</motion.div>

				<div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
					{/* Profile Card - Compact */}
					<ProfileCard profile={profile} role="organization" />

					{/* Details Section - Wider (extracted) */}
					<ProfileDetails profile={profile} role="organization" />
				</div>
			</motion.div>
		</div>
	);
}
