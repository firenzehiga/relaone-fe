import { useAdminAnalytics } from "@/_hooks/useUsers";
import { lazy } from "react";
const AdminAnalytics = lazy(() => import("@/components/admin/AdminAnalytics")); // "@/components/admin/AdminAnalytics";

export default function AdminDashboard() {
	const { data: analyticsData, isLoading, error } = useAdminAnalytics();

	return (
		<div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
			<div className="max-w-7xl mx-auto">
				{/* Analytics Dashboard Component */}
				<AdminAnalytics data={analyticsData} isLoading={isLoading} error={error} />
			</div>
		</div>
	);
}
