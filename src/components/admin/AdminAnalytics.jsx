import { useMemo } from "react";
import {
	LineChart,
	Line,
	BarChart,
	Bar,
	LabelList,
	PieChart,
	Pie,
	Cell,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
} from "recharts";
import StatsCard from "./StatsCard";
import Card from "../ui/Card";
import Skeleton from "../ui/Skeleton";
import { formatRelativeTime } from "@/utils/dateFormatter";
import Badge from "../ui/Badge";
import { AlertCircle } from "lucide-react";
/**
 * AdminAnalytics Component
 * Component untuk menampilkan analytics dashboard dengan berbagai statistik dan charts
 *
 * @param {Object} props - Props untuk AdminAnalytics component
 * @param {Object} props.data - Data analytics dari API
 * @param {boolean} props.isLoading - Status loading
 * @param {Object} props.error - Error object jika ada error
 * @returns {JSX.Element} AdminAnalytics component
 */
export default function AdminAnalytics({ data, isLoading, error }) {
	// Chart colors
	const COLORS = {
		primary: "#3b82f6",
		success: "#10b981",
		warning: "#f59e0b",
		danger: "#ef4444",
		purple: "#8b5cf6",
		pink: "#ec4899",
		indigo: "#6366f1",
	};

	const PIE_COLORS = [
		COLORS.primary,
		COLORS.success,
		COLORS.warning,
		COLORS.danger,
		COLORS.purple,
		COLORS.pink,
	];

	/*  usersByRoleData
	 * Data untuk menampilkan statistik pengguna berdasarkan rolenya dalam bentuk pie chart.
	 *
	 * Cara kerja:
	 * 1. Mengecek apakah data.users.users_by_role tersedia. Jika tidak, mengembalikan array kosong.
	 * 2. Menggunakan Object.entries untuk mengubah objek users_by_role menjadi array pasangan [role, count].
	 * 3. Memetakan setiap pasangan menjadi objek dengan properti name (role dengan huruf kapital) dan value (jumlah pengguna).
	 * 4. Menggunakan filter untuk memilih hanya pasangan yang memiliki count (jumlah pengguna) lebih besar dari 0.
	 */
	const usersByRoleData = useMemo(() => {
		if (!data?.users?.users_by_role) return [];
		return Object.entries(data.users.users_by_role)
			.map(([role, count]) => ({
				name: role.charAt(0).toUpperCase() + role.slice(1),
				value: count,
			}))
			.filter((entry) => Number(entry.value) > 0);
	}, [data]);

	/*  usersByStatusData
	 * Data untuk menampilkan statistik pengguna berdasarkan statusnya dalam bentuk pie chart.
	 *
	 * Cara kerja:
	 * 1. Mengecek apakah data.users.users_by_status tersedia. Jika tidak, mengembalikan array kosong.
	 * 2. Menggunakan Object.entries untuk mengubah objek users_by_status menjadi array pasangan [status, count].
	 * 3. Memetakan setiap pasangan menjadi objek dengan properti name (status dengan huruf kapital) dan value (jumlah pengguna).
	 * 4. Menggunakan filter untuk memilih hanya pasangan yang memiliki count (jumlah pengguna) lebih besar dari 0.
	 */
	const usersByStatusData = useMemo(() => {
		if (!data?.users?.users_by_status) return [];
		return Object.entries(data.users.users_by_status)
			.map(([status, count]) => ({
				name: status.charAt(0).toUpperCase() + status.slice(1),
				value: count,
			}))
			.filter((entry) => Number(entry.value) > 0);
	}, [data]);

	/*  participantsByStatusData
	 * Data untuk menampilkan statistik partisipan berdasarkan statusnya dalam bentuk pie chart.
	 *
	 * Cara kerja:
	 * 1. Mengecek apakah data.participants.participants_by_status tersedia. Jika tidak, mengembalikan array kosong.
	 * 2. Menggunakan Object.entries untuk mengubah objek participants_by_status menjadi array pasangan [status, count].
	 * 3. Memetakan setiap pasangan menjadi objek dengan properti name (status dengan huruf kapital) dan value (jumlah partisipan).
	 * 4. Menggunakan filter untuk memilih hanya pasangan yang memiliki count (jumlah partisipan) lebih besar dari 0.
	 */
	const participantsByStatusData = useMemo(() => {
		if (!data?.participants?.participants_by_status) return [];
		return Object.entries(data.participants.participants_by_status)
			.map(([status, count]) => ({
				name: status.charAt(0).toUpperCase() + status.slice(1),
				value: count,
			}))
			.filter((entry) => Number(entry.value) > 0);
	}, [data]);

	/*  loginTrendData
	 * Data untuk menampilkan tren login pengguna dalam bentuk line chart.
	 *
	 * Cara kerja:
	 * 1. Mengecek apakah data.users.login_trend tersedia. Jika tidak, mengembalikan array kosong.
	 * 2. Menggunakan map untuk mengubah array login_trend menjadi array objek dengan properti date (tanggal) dan count (jumlah login).
	 * 3. Menggunakan toLocaleDateString untuk mengubah format tanggal menjadi format Indonesia.
	 * 4. Menggunakan filter untuk memilih hanya objek yang memiliki count (jumlah login) lebih besar dari 0.
	 */
	const loginTrendData = useMemo(() => {
		if (!data?.users?.login_trend) return [];
		return data.users.login_trend.map((item) => ({
			date: new Date(item.date).toLocaleDateString("id-ID", {
				day: "2-digit",
				month: "short",
			}),
			count: item.count,
		}));
	}, [data]);

	/*  registrationTrendData
	 * Data untuk menampilkan tren registrasi partisipan dalam bentuk line chart.
	 *
	 * Cara kerja:
	 * 1. Mengecek apakah data.participants.registration_trend tersedia. Jika tidak, mengembalikan array kosong.
	 * 2. Menggunakan map untuk mengubah array registration_trend menjadi array objek dengan properti date (tanggal) dan count (jumlah registrasi).
	 * 3. Menggunakan toLocaleDateString untuk mengubah format tanggal menjadi format Indonesia.
	 * 4. Menggunakan filter untuk memilih hanya objek yang memiliki count (jumlah registrasi) lebih besar dari 0.
	 */
	const registrationTrendData = useMemo(() => {
		if (!data?.participants?.registration_trend) return [];
		return data.participants.registration_trend.map((item) => ({
			date: new Date(item.date).toLocaleDateString("id-ID", {
				day: "2-digit",
				month: "short",
			}),
			count: item.count,
		}));
	}, [data]);

	/*  CustomTooltip
	 * function untuk menampilkan tooltip kustom pada charts.
	 *
	 * Cara kerja:
	 * 1. Mengecek apakah active dan payload tersedia. Jika tidak, mengembalikan null.
	 * 2. Mengembalikan elemen div yang berisi informasi label dan value dari payload.
	 */ const CustomTooltip = ({ active, payload, label }) => {
		if (active && payload && payload.length) {
			return (
				<div className="bg-white px-4 py-2 border border-gray-200 rounded-lg shadow-lg">
					<p className="text-sm font-medium text-gray-900">{label}</p>
					<p className="text-sm text-gray-600">
						{payload[0].name}: <span className="font-bold">{payload[0].value}</span>
					</p>
				</div>
			);
		}
		return null;
	};

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

	if (!data) {
		return (
			<div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
				<p className="text-gray-600">No analytics data available</p>
			</div>
		);
	}

	return (
		<div className="space-y-8">
			{/* Key Metrics Overview - Reduced to 6 most important cards */}
			<div>
				<h2 className="text-2xl font-bold text-gray-900 mb-4">📊 Ringkasan Statistik</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{/* Users */}
					<StatsCard
						title="Total Pengguna"
						value={data.users?.total_users || 0}
						icon={
							<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
								/>
							</svg>
						}
						color="blue"
						description={`${data.users?.active_users || 0} Aktif, ${
							data.users?.new_users || 0
						} Baru Bergabung`}
					/>

					{/* Events */}
					<StatsCard
						title="Total Event"
						value={data.events?.total_events || 0}
						icon={
							<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
								/>
							</svg>
						}
						color="orange"
						description={`${data.events?.upcoming_events || 0} Akan Datang, ${
							data.events?.ongoing_events || 0
						} Berlangsung, ${data.events?.completed_events || 0} Selesai `}
					/>

					{/* Participants */}
					<StatsCard
						title="Total Partisipan"
						value={data.participants?.total_participants || 0}
						icon={
							<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
								/>
							</svg>
						}
						color="green"
						description={`${
							data.participants?.participants_by_status?.confirmed || 0
						} Dikonfirmasi, ${
							data?.participants?.participants_by_status?.registered || 0
						} Baru Registrasi`}
					/>

					{/* Login Activity */}
					<StatsCard
						title="Total Aktivitas Login"
						value={loginTrendData.reduce((sum, item) => sum + item.count, 0) || 0}
						icon={
							<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
								/>
							</svg>
						}
						color="indigo"
						description="7 hari terakhir"
					/>

					{/* Completed Events */}
					<StatsCard
						title="Total Event Selesai"
						value={data.events?.completed_events || 0}
						icon={
							<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
								/>
							</svg>
						}
						color="purple"
						description="Total event terlaksana"
					/>

					{/* Attendance Rate */}
					<StatsCard
						title="Tingkat Kehadiran"
						value={`${data.participants?.attendance_rate || 0}%`}
						icon={
							<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
								/>
							</svg>
						}
						color="pink"
						description="Rata-rata kehadiran partisipan"
					/>
				</div>
			</div>

			{/* Charts Section */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* Users by Role - Pie Chart */}
				<Card>
					<h3 className="text-lg font-bold text-gray-900 mb-4">Pengguna Berdasarkan Role</h3>
					{usersByRoleData.length === 0 ? (
						<div className="py-16 text-center text-gray-500">Belum ada data role pengguna</div>
					) : (
						<ResponsiveContainer width="100%" height={300}>
							<PieChart>
								<Pie
									data={usersByRoleData}
									cx="50%"
									cy="50%"
									labelLine={false}
									label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
									outerRadius={80}
									fill="#8884d8"
									dataKey="value">
									{usersByRoleData.map((entry, index) => (
										<Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
									))}
								</Pie>
								<Tooltip />
								<Legend />
							</PieChart>
						</ResponsiveContainer>
					)}
				</Card>

				{/* Users by Status - Pie Chart */}
				<Card>
					<h3 className="text-lg font-bold text-gray-900 mb-4">Pengguna Berdasarkan Status</h3>
					{usersByStatusData.length === 0 ? (
						<div className="py-16 text-center text-gray-500">Belum ada data status pengguna</div>
					) : (
						<ResponsiveContainer width="100%" height={300}>
							<PieChart>
								<Pie
									data={usersByStatusData}
									cx="50%"
									cy="50%"
									labelLine={false}
									label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
									outerRadius={80}
									fill="#8884d8"
									dataKey="value">
									{usersByStatusData.map((entry, index) => (
										<Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
									))}
								</Pie>
								<Tooltip />
								<Legend />
							</PieChart>
						</ResponsiveContainer>
					)}
				</Card>
			</div>

			{/* Line Charts */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* Login Trend */}
				<Card>
					<h3 className="text-lg font-bold text-gray-900 mb-4">Tren Login (7 Hari Terakhir)</h3>
					<ResponsiveContainer width="100%" height={300}>
						<LineChart data={loginTrendData}>
							<CartesianGrid strokeDasharray="3 3" />
							<XAxis dataKey="date" />
							<YAxis
								allowDecimals={false}
								tickFormatter={(v) => (Number.isInteger(v) ? v : Math.round(v))}
							/>
							<Tooltip content={<CustomTooltip />} />
							<Legend />
							<Line
								type="monotone"
								dataKey="count"
								name="Logins"
								stroke={COLORS.primary}
								strokeWidth={2}
								dot={{ fill: COLORS.primary, r: 4 }}
								activeDot={{ r: 6 }}
							/>
						</LineChart>
					</ResponsiveContainer>
				</Card>

				{/* Registration Trend */}
				<Card>
					<h3 className="text-lg font-bold text-gray-900 mb-4">Tren Pendaftaran Partisipan</h3>
					<ResponsiveContainer width="100%" height={300}>
						<LineChart data={registrationTrendData}>
							<CartesianGrid strokeDasharray="3 3" />
							<XAxis dataKey="date" />
							<YAxis
								allowDecimals={false}
								tickFormatter={(v) => (Number.isInteger(v) ? v : Math.round(v))}
							/>
							<Tooltip content={<CustomTooltip />} />
							<Legend />
							<Line
								type="monotone"
								dataKey="count"
								name="Registrations"
								stroke={COLORS.success}
								strokeWidth={2}
								dot={{ fill: COLORS.success, r: 4 }}
								activeDot={{ r: 6 }}
							/>
						</LineChart>
					</ResponsiveContainer>
				</Card>
			</div>

			{/* Participants by Status - Bar Chart */}
			<Card>
				<h3 className="text-lg font-bold text-gray-900 mb-4">Partisipan Berdasarkan Status</h3>
				{participantsByStatusData.length === 0 ? (
					<div className="py-16 text-center text-gray-500">
						Belum ada data partisipan berdasarkan status
					</div>
				) : (
					<ResponsiveContainer width="100%" height={300}>
						<BarChart data={participantsByStatusData}>
							<CartesianGrid strokeDasharray="3 3" />
							<XAxis dataKey="name" />
							<YAxis
								allowDecimals={false}
								tickFormatter={(v) => (Number.isInteger(v) ? v : Math.round(v))}
							/>
							<Tooltip content={<CustomTooltip />} />
							<Legend />
							<Bar dataKey="value" name="Count" fill={COLORS.primary} radius={[8, 8, 0, 0]}>
								<LabelList dataKey="value" position="top" formatter={(v) => Math.round(v)} />
							</Bar>
						</BarChart>
					</ResponsiveContainer>
				)}
			</Card>

			{/* Recent Logins & Most Active Users */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* Recent Logins */}
				<Card>
					<h3 className="text-lg font-bold text-gray-900 mb-4">Login Terbaru</h3>
					<div className="space-y-3">
						{data.users?.recent_logins?.length > 0 ? (
							data.users.recent_logins.slice(0, 5).map((user) => (
								<div
									key={user.id}
									className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
									<div className="flex-1">
										<p className="font-medium text-gray-900">{user.nama}</p>
										<p className="text-sm text-gray-600">{user.email}</p>
										<p className="text-xs text-gray-500 mt-1">
											{formatRelativeTime(user.last_login_at)}
										</p>
									</div>
									<div className="ml-4">
										<Badge
											variant={
												user.role === "admin"
													? "orange"
													: user.role === "organization"
													? "success"
													: "primary"
											}>
											{user.role === "admin"
												? "Admin"
												: user.role === "organization"
												? "Organization"
												: "Volunteer"}
										</Badge>
									</div>
								</div>
							))
						) : (
							<p className="text-gray-500 text-center py-4">Belum ada login terbaru</p>
						)}
					</div>
				</Card>

				{/* Most Active Users */}
				<Card>
					<h3 className="text-lg font-bold text-gray-900 mb-4">Pengguna Paling Aktif</h3>
					<div className="space-y-3">
						{data.users?.most_active_users?.length > 0 ? (
							data.users.most_active_users.slice(0, 5).map((user) => (
								<div
									key={user.id}
									className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
									<div className="flex-1">
										<p className="font-medium text-gray-900">{user.nama}</p>
										<p className="text-sm text-gray-600">{user.email}</p>
									</div>
									<div className="ml-4 text-right">
										<p className="text-lg font-bold text-blue-600">{user.login_count}</p>
										<p className="text-xs text-gray-500">logins</p>
									</div>
								</div>
							))
						) : (
							<p className="text-gray-500 text-center py-4">Belum ada data pengguna aktif</p>
						)}
					</div>
				</Card>
			</div>
		</div>
	);
}
