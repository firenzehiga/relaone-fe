import { useState } from "react";
import { useOrgAnalytics } from "@/_hooks/useUsers";
import { useOrgEvents } from "@/_hooks/useEvents";
import OrganizationAnalytics from "@/components/organization/OrganizationAnalytics";
import { useAuthStore } from "@/_hooks/useAuth";
import OrganizationPending from "@/components/fallback/OrganizationPending";

export default function OrganizationDashboard() {
	const [selectedEventId, setSelectedEventId] = useState("");
	const { user } = useAuthStore();
	// fetch list of org events for selector
	const { data: eventsData, isLoading: eventsLoading } = useOrgEvents();

	// pass event_id param when selected (empty -> no filter)
	const params = selectedEventId ? { event_id: selectedEventId } : {};
	const {
		data: analyticsData,
		isLoading: analyticsLoading,
		error,
	} = useOrgAnalytics(params);

	if (user.organization.status_verifikasi === "pending") {
		return <OrganizationPending />;
	}
	return (
		<div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
			<div className="max-w-7xl mx-auto">
				{/* Event selector */}
				<div className="mb-6 flex items-center justify-end">
					<label className="mr-3 text-sm font-medium text-gray-700">
						Filter Event:
					</label>
					<select
						value={selectedEventId}
						onChange={(e) => setSelectedEventId(e.target.value)}
						className="border border-gray-200 rounded-lg px-3 py-2 bg-white text-sm">
						<option value="">Semua Event</option>
						{eventsData &&
							Array.isArray(eventsData) &&
							eventsData.map((ev) => (
								<option key={ev.id} value={ev.id}>
									{ev.judul}
								</option>
							))}
					</select>
				</div>

				<OrganizationAnalytics
					data={analyticsData}
					isLoading={analyticsLoading || eventsLoading}
					error={error}
					selectedEventId={selectedEventId}
				/>
			</div>
		</div>
	);
}
