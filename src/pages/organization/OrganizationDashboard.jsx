import { lazy, useState } from "react";

// Hooks / Stores
const OrganizationAnalytics = lazy(
	() => import("@/components/organization/OrganizationAnalytics"),
); // "@/components/organization/OrganizationAnalytics";
const OrganizationPending = lazy(
	() => import("@/components/fallback/OrganizationPending"),
); // "@/components/fallback/OrganizationPending";
import { useOrgAnalytics } from "@/_hooks/useUsers";
import { useOrgEvents } from "@/_hooks/useEvents";
import { useAuthStore } from "@/_hooks/useAuth";

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

	if (user.organization.status_verifikasi !== "verified") {
		return (
			<OrganizationPending
				status_verifikasi={user.organization.status_verifikasi}
			/>
		);
	}
	return (
		<div className="space-y-6">
			{/* Event selector */}
			<div className="flex items-center justify-end">
				<label className="mr-3 text-sm font-medium text-gray-700">
					Filter Kegiatan:
				</label>
				<select
					value={selectedEventId}
					onChange={(e) => setSelectedEventId(e.target.value)}
					className="border border-gray-200 rounded-lg px-3 py-2 bg-white text-sm relative z-10">
					<option value="">Semua Kegiatan</option>
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
	);
}
