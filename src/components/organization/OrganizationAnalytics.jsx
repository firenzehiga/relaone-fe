import { useMemo } from "react";
import { Calendar, Users, Activity, CheckSquare, AlertCircle, Star } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import StatsCard from "@/components/admin/StatsCard";
import Card from "@/components/ui/Card";
import Skeleton from "@/components/ui/Skeleton";
import Badge from "@/components/ui/Badge";
import RatingStars from "@/components/ui/RatingStars";
import { formatRelativeTime, formatDate } from "@/utils/dateFormatter";
import { color } from "framer-motion";

/**
 * OrganizationAnalytics
 * - Menampilkan ringkasan (overview), analytics event, peserta, volunteer, dan feedback
 * - Dirancang untuk ringkas, informatif, dan mudah di-scan oleh user
 */
export default function OrganizationAnalytics({ data, isLoading, error, selectedEventId }) {
	// Defensive: accept both full API response ({ data: { ... } }) or analytics object
	const analytics = data?.data ?? data ?? null;

	const overview = analytics?.overview ?? {};
	const events = analytics?.events ?? {};
	const participants = analytics?.participants ?? {};
	const volunteers = analytics?.volunteers ?? {};
	const recentFeedbacks = analytics?.recent_feedbacks ?? [];

	/*  feedbacksToShow
	 * - Memfilter feedbacks berdasarkan event_id jika selectedEventId diberikan
	 * - Jika selectedEventId tidak diberikan, maka semua feedbacks akan ditampilkan
	 */
	const feedbacksToShow = useMemo(() => {
		if (!selectedEventId) return recentFeedbacks || [];
		return (recentFeedbacks || []).filter((f) => {
			const fid = f.event_id ?? f.event?.id ?? f.event?.event_id ?? null;
			return fid != null && fid == selectedEventId;
		});
	}, [recentFeedbacks, selectedEventId]);

	const upcomingEvents = events?.events_by_status?.upcoming ?? [];

	/*  chartData
	 * - Memfilter participants berdasarkan event_id jika selectedEventId diberikan
	 * - Jika selectedEventId tidak diberikan, maka semua participants akan ditampilkan
	 * - Sumber data utama adalah participants_by_event, jika tidak ada maka fallback ke events upcoming
	 * - Data ini digunakan untuk membuat chart batang persentase terisi per event
	 */
	const chartData = useMemo(() => {
		const source =
			participants?.participants_by_event && participants.participants_by_event.length
				? participants.participants_by_event
				: events?.events_by_status?.upcoming ?? [];

		return (source || []).map((e) => ({
			name: (e.judul || e.event_judul || `Event ${e.id || e.event_id}`)?.slice(0, 18),
			percent_full:
				e.percent_full ?? Math.round(((e.peserta_saat_ini ?? 0) / (e.maks_peserta || 1)) * 100),
			confirmed: e.confirmed ?? e.confirmed_count ?? 0,
			total: e.total_participants ?? e.peserta_saat_ini ?? 0,
		}));
	}, [participants, events]);

	/*  avgRating
	 * - Menghitung rata-rata rating dari feedbacks yang ditampilkan
	 * - Jika selectedEventId diberikan, gunakan feedbacks yang sudah difilter
	 * - Jika tidak, gunakan semua recentFeedbacks
	 */
	const avgRating = useMemo(() => {
		const source = selectedEventId ? feedbacksToShow : recentFeedbacks;
		if (!source || source.length === 0) return 0;
		const sum = source.reduce((s, f) => s + (f.rating || 0), 0);
		return +(sum / source.length).toFixed(2);
	}, [recentFeedbacks, feedbacksToShow, selectedEventId]);

	/*  totalParticipants
	 * - Menghitung total peserta dari data participants
	 */
	const totalParticipants = participants.total_participants ?? 0;

	/*  percentConfirmed
	 * - Menghitung persentase peserta yang sudah dikonfirmasi dari total peserta
	 */
	const percentConfirmed = totalParticipants
		? Math.min(100, Math.round(((participants.confirmed ?? 0) / totalParticipants) * 100))
		: 0;

	/*  percentAttended
	 * - Menghitung persentase peserta yang sudah hadir dari total peserta
	 */
	const percentAttended = totalParticipants
		? Math.min(100, Math.round(((participants.attended ?? 0) / totalParticipants) * 100))
		: 0;

	if (isLoading) {
		return <Skeleton.AnalyticsSkeleton />;
	}

	if (error) {
		return (
			<div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
				<div className="flex flex-col items-center justify-center  text-gray-600">
					<AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
					<h3 className="text-lg font-semibold mb-2">Error loading analytics data</h3>
					<p className="text-gray-500 mb-4 text-center">Gagal mengambil data analytics.</p>
					<p className="text-red-500 mb-4 text-center font-semibold">{error?.message}</p>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Overview stats */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
				<StatsCard
					title="Total Event"
					value={overview.total_events ?? 0}
					description={`Dibuat dalam periode: ${overview.events_created_in_period ?? 0}`}
					icon={<Activity />}
				/>

				<StatsCard
					title="Upcoming"
					value={overview.upcoming_events ?? 0}
					description={`Menunggu dimulai`}
					icon={<Calendar />}
					color="orange"
				/>

				<StatsCard
					title="Pending Registrations"
					value={overview.pending_registrations_count ?? 0}
					description="Perlu konfirmasi peserta"
					icon={<Users />}
					color="yellow"
				/>

				<StatsCard
					title="Rata‑rata Utilisasi"
					value={`${events.average_capacity_utilization_percent ?? 0}%`}
					description="Persentase rata‑rata kapasitas terpakai"
					icon={<CheckSquare />}
					color="green"
				/>
			</div>
			{/* Small overview badges (status ringkas event) pakai judul header*/}
			<h1 className="text-2xl font-bold text-gray-900 mb-3 border-emerald-600">Status Event</h1>
			<div className="flex flex-wrap gap-3 mt-2">
				<Badge variant="warning" size="md">
					Sedang Berlangsung: {overview.active_events ?? 0}
				</Badge>
				<Badge variant="success" size="md">
					Sudah Selesai: {overview.completed_events ?? 0}
				</Badge>
				<Badge variant="orange" size="md">
					Dibatalkan: {overview.cancelled_events ?? 0}
				</Badge>
				<Badge variant="primary" size="md">
					Telah Dibuat (periode): {overview.events_created_in_period ?? 0}
				</Badge>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* LEFT: Events */}
				<Card className="p-6">
					<div className="flex items-center justify-between mb-3">
						<div className="flex items-center gap-3">
							<Activity className="w-5 h-5 text-indigo-500" />
							<h4 className="font-semibold text-gray-800">Events</h4>
						</div>
						<Badge variant="outline" size="sm">
							{upcomingEvents.length} upcoming
						</Badge>
					</div>

					{(events.nearly_full_events ?? []).length > 0 && (
						<div className="mt-4">
							<h5 className="text-sm font-medium text-gray-700 mb-2">Hampir penuh</h5>
							<div className="space-y-2">
								{events.nearly_full_events.map((nf) => (
									<div
										key={nf.id}
										className="flex items-center justify-between py-2 border-b last:border-b-0">
										<div className="text-sm font-medium">{nf.judul}</div>
										<div className="text-xs text-gray-500">
											{nf.peserta_saat_ini}/{nf.maks_peserta}
										</div>
									</div>
								))}
							</div>
						</div>
					)}

					{chartData.length > 0 && (
						<div className="mt-4">
							<div className="bg-white border border-gray-100 rounded p-2 h-48 w-full">
								<ResponsiveContainer width="100%" height="100%">
									<BarChart data={chartData} margin={{ top: 6, right: 6, left: 0, bottom: 0 }}>
										<CartesianGrid strokeDasharray="3 3" opacity={0.4} />
										<XAxis dataKey="name" tick={{ fontSize: 11 }} />
										<YAxis />
										<Tooltip />
										<Bar dataKey="percent_full" fill="#6366F1" name="% Terisi" />
									</BarChart>
								</ResponsiveContainer>
							</div>
							<div className="text-xs text-gray-500 mt-2">
								Chart: Persentase terisi per event (sumber: peserta per event / upcoming)
							</div>
						</div>
					)}

					<hr className="my-4" />

					<h5 className="text-sm font-medium mb-2">Upcoming events</h5>
					<div className="space-y-2">
						{upcomingEvents.length === 0 ? (
							<p className="text-sm text-gray-500">Tidak ada event mendatang.</p>
						) : (
							upcomingEvents.map((ev) => (
								<div
									key={ev.id}
									className="flex items-center justify-between py-3 border-b last:border-b-0">
									<div>
										<div className="text-sm font-medium text-gray-800">{ev.judul}</div>
										<div className="text-xs text-gray-500">
											Mulai: {formatDate(ev.tanggal_mulai)}
										</div>
									</div>
									<div className="text-right">
										<div className="text-sm font-medium">{ev.percent_full ?? 0}%</div>
										<div className="text-xs text-gray-500">
											{ev.peserta_saat_ini ?? 0}/{ev.maks_peserta ?? 0}
										</div>
									</div>
								</div>
							))
						)}
					</div>
				</Card>

				{/* MIDDLE: Participants (improved) */}
				<Card className="p-6">
					<div className="flex items-center justify-between mb-3">
						<div className="flex items-center gap-3">
							<Users className="w-5 h-5 text-emerald-500" />
							<h4 className="font-semibold text-gray-800">Peserta</h4>
						</div>
						<Badge variant="info" size="sm">
							Total {totalParticipants}
						</Badge>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
						<div className="space-y-1">
							<div className="flex items-center justify-between">
								<p className="text-xs text-gray-500">Confirmed</p>
								<div className="text-sm font-medium text-gray-800">
									{participants.confirmed ?? 0}
								</div>
							</div>
							<div className="w-full bg-gray-100 rounded h-2 mt-1">
								<div
									className="h-2 rounded bg-emerald-500"
									style={{ width: `${percentConfirmed}%` }}
								/>
							</div>
						</div>

						<div className="space-y-1">
							<div className="flex items-center justify-between">
								<p className="text-xs text-gray-500">Attended</p>
								<div className="text-sm font-medium text-gray-800">
									{participants.attended ?? 0}
								</div>
							</div>
							<div className="w-full bg-gray-100 rounded h-2 mt-1">
								<div
									className="h-2 rounded bg-emerald-300"
									style={{ width: `${percentAttended}%` }}
								/>
							</div>
						</div>
					</div>

					{/* participants by status - grid */}
					<div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
						{Object.entries(participants.participants_by_status ?? {}).map(([k, v]) => {
							const mapVariant = {
								registered: {
									color: "gray",
									status: "Mendaftar",
								},
								confirmed: {
									color: "blue",
									status: "Dikonfirmasi",
								},
								rejected: {
									color: "red",
									status: "Ditolak",
								},
								cancelled: {
									color: "orange",
									status: "Dibatalkan",
								},
								attended: {
									color: "green",
									status: "Hadir",
								},
								no_show: {
									color: "yellow",
									status: "Tidak Hadir",
								},
							};
							return (
								<div
									key={k}
									className={`flex items-center justify-between px-3 py-2 bg-${mapVariant[k].color}-100 rounded`}>
									<div className="text-xs text-gray-600"> {mapVariant[k].status} </div>
									<div className="text-sm font-medium text-gray-800">{v}</div>
								</div>
							);
						})}
					</div>

					<div className="space-y-2">
						{(participants.participants_by_event ?? []).length === 0 ? (
							<p className="text-sm text-gray-500">Belum ada data peserta per event.</p>
						) : (
							participants.participants_by_event.map((pe) => {
								const pct =
									pe.percent_full ??
									Math.round(((pe.peserta_saat_ini ?? 0) / (pe.maks_peserta || 1)) * 100);
								return (
									<div key={pe.event_id} className="py-3 border-b last:border-b-0">
										<div className="flex items-center justify-between">
											<div>
												<div className="text-sm font-medium text-gray-800">{pe.judul}</div>
												<div className="text-xs text-gray-500">
													Mulai: {formatDate(pe.tanggal_mulai)}
												</div>
											</div>
											<div className="text-right">
												<div className="text-sm font-medium">
													{pe.peserta_saat_ini ?? 0}/{pe.maks_peserta ?? 0}
												</div>
												<div className="text-xs text-gray-500">{pct}%</div>
											</div>
										</div>
										<div className="w-full bg-gray-100 rounded h-2 mt-2">
											<div className="h-2 rounded bg-indigo-500" style={{ width: `${pct}%` }} />
										</div>
									</div>
								);
							})
						)}
					</div>

					<hr className="my-4" />

					<h5 className="text-sm font-medium mb-2">Pendaftaran baru</h5>
					<div className="space-y-2">
						{(participants.pending_registrations ?? []).length === 0 ? (
							<p className="text-sm text-gray-500">Tidak ada pendaftaran pending.</p>
						) : (
							(participants.pending_registrations ?? []).map((p) => (
								<div key={p.id} className="flex items-start justify-between py-3 border rounded">
									<div className="flex-1">
										<div className="text-sm font-medium">{p.nama}</div>
										<div className="text-xs text-gray-500">
											{p.event_judul} · {formatRelativeTime(p.tanggal_daftar)}
										</div>
									</div>
									<div className="ml-4">
										<Badge variant="warning" size="sm">
											{p.status}
										</Badge>
									</div>
								</div>
							))
						)}
					</div>
				</Card>
			</div>

			{/* FULL-WIDTH: Feedback card below the three-column grid */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<Card className="p-6">
					<div className="flex items-center justify-between mb-3">
						<h4 className="font-semibold text-gray-800">Feedback terbaru</h4>
						<div className="flex items-center gap-3">
							<RatingStars rating={avgRating} size="sm" />
							<Badge variant="primary" size="sm">
								{(feedbacksToShow ?? []).length} items
							</Badge>
						</div>
					</div>

					{(feedbacksToShow ?? []).length === 0 ? (
						<p className="text-sm text-gray-500">
							{selectedEventId ? "Belum ada feedback untuk event ini." : "Belum ada feedback."}
						</p>
					) : (
						<div className="space-y-3 max-h-80 overflow-y-auto">
							{feedbacksToShow.map((f) => (
								<div key={f.id} className="border rounded p-4 bg-white">
									<div className="flex items-start justify-between">
										<div>
											<div className="font-medium text-sm truncate">{f.user_nama}</div>
											<div className="text-xs text-gray-500">
												{f.event_judul} · {formatRelativeTime(f.created_at)}
											</div>
										</div>
										<div className="flex items-center gap-2">
											<RatingStars rating={f.rating ?? 0} size="sm" />
										</div>
									</div>
									<p className="text-sm text-gray-700 mt-2 leading-relaxed">{f.komentar}</p>
								</div>
							))}
						</div>
					)}
				</Card>
				{/* RIGHT: Volunteers (only) */}
				<Card className="p-6">
					<div className="flex items-center justify-between mb-3">
						<h4 className="font-semibold text-gray-800">Volunteers</h4>
						<div className="flex items-center gap-3">
							<Badge variant="success" size="sm">
								Top {volunteers.top_volunteers?.length ?? 0}
							</Badge>
						</div>
					</div>

					<div className="mb-3">
						<p className="text-xs text-gray-500 mb-2">Top volunteers</p>
						{(volunteers.top_volunteers ?? []).length === 0 ? (
							<p className="text-sm text-gray-500">Belum ada volunteer aktif.</p>
						) : (
							<div className="space-y-2">
								{volunteers.top_volunteers.map((v) => (
									<div
										key={v.user_id}
										className="flex items-center justify-between py-2 border-b last:border-b-0">
										<div className="text-sm">{v.nama}</div>
										<div className="text-xs text-gray-500">{v.participations}x Partisipasi</div>
									</div>
								))}
							</div>
						)}
					</div>

					<div className="mb-3">
						<p className="text-xs text-gray-500 mb-2">Recent volunteers</p>
						{(volunteers.recent_volunteers ?? []).length === 0 ? (
							<p className="text-sm text-gray-500">Belum ada volunteer baru.</p>
						) : (
							<div className="space-y-2">
								{volunteers.recent_volunteers.map((rv) => {
									const mapVariant = {
										registered: {
											color: "default",
											status: "Mendaftar",
										},
										confirmed: {
											color: "primary",
											status: "Dikonfirmasi",
										},
										rejected: {
											color: "danger",
											status: "Ditolak",
										},
										cancelled: {
											color: "orange",
											status: "Dibatalkan",
										},
										attended: {
											color: "success",
											status: "Hadir",
										},
										no_show: {
											color: "warning",
											status: "Tidak Hadir",
										},
									};
									return (
										<div
											key={rv.id}
											className="flex items-center justify-between py-2 border-b last:border-b-0">
											<div>
												<div className="text-sm font-medium">{rv.nama}</div>
												<div className="text-xs text-gray-500">
													{rv.event_id ? `Event #${rv.event_id}` : "-"} ·{" "}
													{formatRelativeTime(rv.tanggal_daftar)}
												</div>
											</div>
											<Badge variant={mapVariant[rv.status].color} size="sm">
												{mapVariant[rv.status].status}
											</Badge>
										</div>
									);
								})}
							</div>
						)}
					</div>
				</Card>
			</div>
		</div>
	);
}
