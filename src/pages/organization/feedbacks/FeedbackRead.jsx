import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

// UI Libraries
import DataTable from "react-data-table-component";
import { EllipsisVerticalIcon, AlertCircle, ChevronDown, Loader2, Eye } from "lucide-react";
import { Menu, MenuButton, MenuList, MenuItem, Portal, IconButton } from "@chakra-ui/react";

// Hooks
import { useOrgFeedbacks } from "@/_hooks/useFeedbacks";

// Helpers
import { formatDateDay, formatDate } from "@/utils/dateFormatter";

// UI Components
import RatingStars from "@/components/ui/RatingStars";
import FetchLoader from "@/components/ui/FetchLoader";

export default function OrganizationFeedback() {
	const {
		data: feedbacks = [],
		isLoading: feedbacksLoading,
		error: feedbacksError,
		isFetching: feedbacksRefetching,
	} = useOrgFeedbacks();

	// Local state for search/filter
	const [searchFeedback, setSearchFeedback] = useState("");
	const [eventFilter, setEventFilter] = useState("all");

	// Get unique events from feedbacks
	const availableEvents = useMemo(() => {
		const eventMap = new Map();
		feedbacks.forEach((feedback) => {
			if (feedback.event?.id) {
				eventMap.set(feedback.event.id, {
					id: feedback.event.id,
					judul: feedback.event.judul,
				});
			}
		});
		return Array.from(eventMap.values());
	}, [feedbacks]);

	const filteredFeedbacks = useMemo(() => {
		let filtered = feedbacks;

		// Filter by event
		if (eventFilter !== "all") {
			filtered = filtered.filter((feedback) => feedback.event?.id === parseInt(eventFilter));
		}

		// Filter by search query
		if (searchFeedback) {
			const query = searchFeedback.toLowerCase();
			filtered = filtered.filter((feedbackItem) => {
				const user = String(feedbackItem.user?.nama || "").toLowerCase();
				const tglKomentar = formatDateDay(feedbackItem.created_at).toLowerCase();
				const event = String(feedbackItem.event?.judul || "").toLowerCase();
				return user.includes(query) || event.includes(query) || tglKomentar.includes(query);
			});
		}

		return filtered;
	}, [feedbacks, searchFeedback, eventFilter]);

	const columns = [
		{
			name: "No",
			cell: (row, index) => index + 1,
			sortable: false,
			width: "60px",
		},
		{
			name: "Nama User",
			selector: (row) => row.user?.nama || "-",
			sortable: true,
			wrap: true,
			width: "200px",
		},
		{
			name: "Nama Event",
			selector: (row) => row.event?.judul || "-",
			sortable: false,
			wrap: true,
		},
		{
			name: "Tanggal Komentar",
			selector: (row) => formatDateDay(row.created_at) || "-",
			sortable: false,
			wrap: true,
		},
		{
			name: "Rating",
			cell: (row) => {
				const rating = Math.max(0, Math.min(5, Number(row.rating) || 0));
				return <RatingStars rating={rating} maxRating={5} size="sm" interactive={false} />;
			},
			sortable: false,
			width: "220px",
		},
		{
			name: "Aksi",
			cell: (row) => (
				<Menu>
					<MenuButton
						as={IconButton}
						aria-label="Options"
						icon={<EllipsisVerticalIcon />}
						variant="ghost"
					/>
					<Portal>
						<MenuList className="font-semibold">
							<Link to={`/admin/events/edit/${row.id}`}>
								<MenuItem icon={<Eye className="text-blue-500 hover:text-blue-600" />}>
									Lihat
								</MenuItem>
							</Link>
						</MenuList>
					</Portal>
				</Menu>
			),
			width: "140px",
		},
	];

	if (feedbacksError) {
		return (
			<div className="flex flex-col items-center justify-center min-h-[520px] text-gray-600">
				<AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
				<h3 className="text-lg font-semibold mb-2">Error</h3>
				<p className="text-gray-500 mb-4 text-center">Gagal mengambil data feedback.</p>
				<p className="text-red-500 mb-4 text-center font-semibold">{feedbacksError.message}</p>
			</div>
		);
	}

	return (
		<div className="py-8 bg-emerald-100 page-transition min-h-screen">
			<div className="max-w-6xl mx-auto px-4">
				<div className="bg-white rounded-lg shadow p-6">
					<div className="flex justify-between items-center mb-4">
						<h2 className="text-lg font-semibold">Daftar Feedback</h2>
					</div>

					{feedbacksLoading ? (
						<div className="flex h-96 justify-center py-20">
							<Loader2 className="animate-spin h-7 w-7 text-emerald-600" />
						</div>
					) : (
						<>
							{feedbacksRefetching && <FetchLoader />}

							{/* Filter & Search */}
							<div className="flex flex-col sm:flex-row gap-3 mb-4">
								<div className="flex-1 max-w-md">
									<input
										type="text"
										placeholder="Cari user atau event feedback..."
										value={searchFeedback}
										onChange={(e) => setSearchFeedback(e.target.value)}
										className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-emerald-500"
									/>
								</div>
								<div className="w-full sm:w-64">
									<select
										value={eventFilter}
										onChange={(e) => setEventFilter(e.target.value)}
										className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white">
										<option value="all">Semua Event</option>
										{availableEvents.map((event) => (
											<option key={event.id} value={event.id}>
												{event.judul}
											</option>
										))}
									</select>
								</div>
							</div>
							<DataTable
								columns={columns}
								data={filteredFeedbacks}
								pagination
								pointerOnHover
								title=""
								highlightOnHover
								persistTableHead
								responsive
								fixedHeader
								striped
								expandOnRowDoubleClicked
								sortIcon={<ChevronDown />}
								expandableRows
								expandableRowsComponent={({ data }) => {
									return (
										<div className="p-4 bg-gray-50 rounded-md">
											<p className="text-sm text-gray-600">
												<strong>Komentar:</strong> {data.komentar || "-"}
											</p>
										</div>
									);
								}}
								noDataComponent={
									<div className="flex flex-col items-center justify-center h-64 text-gray-600">
										<AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
										<h3 className="text-lg font-semibold mb-2">
											{searchFeedback ? "No Matching Feedback Found" : "No Feedback Available"}
										</h3>
										<p className="text-gray-500 mb-4 text-center">
											{searchFeedback
												? "Tidak ada feedback yang sesuai dengan pencarian."
												: "Belum ada data feedback"}
										</p>
									</div>
								}
							/>
						</>
					)}
				</div>
			</div>
		</div>
	);
}
