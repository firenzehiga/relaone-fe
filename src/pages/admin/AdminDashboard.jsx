import { useAdminAnalytics } from "@/_hooks/useUsers";
import { lazy } from "react";
const AdminAnalytics = lazy(() => import("@/components/admin/AdminAnalytics")); // "@/components/admin/AdminAnalytics";

export default function AdminDashboard() {
	const { data: analyticsData, isLoading, error } = useAdminAnalytics();

	return (
		<div className="space-y-6">
			{/* Analytics Dashboard Component */}
			<AdminAnalytics
				data={analyticsData}
				isLoading={isLoading}
				error={error}
			/>
		</div>
	);
}
