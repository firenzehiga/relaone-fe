import { useAdminAnalytics } from "@/_hooks/useUsers";
import AnalyticsDashboard from "@/components/admin/AnalyticsDashboard";

export default function AdminDashboard() {
	const { data: analyticsData, isLoading, error } = useAdminAnalytics();

	return (
		<div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
			<div className="max-w-7xl mx-auto">
				{/* Analytics Dashboard Component */}
				<AnalyticsDashboard
					data={analyticsData}
					isLoading={isLoading}
					error={error}
				/>
			</div>
		</div>
	);
}
