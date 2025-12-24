import { useAdminDeleteFeedbackMutation, useAdminFeedbacks } from "@/_hooks/useFeedbacks";
import {
	ChevronDown,
	Plus,
	Loader2,
	Trash,
	Eye,
	EditIcon,
	EllipsisVerticalIcon,
	AlertCircle,
} from "lucide-react";
import { Menu, MenuButton, MenuList, MenuItem, Portal, IconButton } from "@chakra-ui/react";
import { swalDelete } from "@/components/ui/Swal";
import { toast } from "react-hot-toast";
import { useEffect, useMemo, useState } from "react";
import DataTable from "react-data-table-component";
import RatingStars from "@/components/ui/RatingStars";
import { Link } from "react-router-dom";
import FetchLoader from "@/components/ui/FetchLoader";
import { useDebounce } from "@/_hooks/utils/useDebounce";

export default function AdminFeedback() {
	const [searchFeedback, setSearchFeedback] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const [rowsPerPage, setRowsPerPage] = useState(10);

	// Debounce search menggunakan custom hook
	const debouncedSearch = useDebounce(searchFeedback, 500); // You can implement debounce if needed

	// Reset ke halaman 1 saat search berubah
	useEffect(() => {
		setCurrentPage(1);
	}, [debouncedSearch]);

	const {
		feedbacks,
		pagination,
		isLoading: feedbacksLoading,
		error: feedbacksError,
		isFetching: feedbacksRefetching,
	} = useAdminFeedbacks(currentPage, rowsPerPage, debouncedSearch);

	const deleteFeedbackMutation = useAdminDeleteFeedbackMutation();
	// Local state for search/filter
	const [eventFilter, setEventFilter] = useState("all");
	const [ratingFilter, setRatingFilter] = useState("all");

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
		return Array.from(eventMap.values()).sort((a, b) => a.judul.localeCompare(b.judul));
	}, [feedbacks]);

	const filteredFeedbacks = useMemo(() => {
		let filtered = feedbacks;

		// Filter by event
		if (eventFilter !== "all") {
			filtered = filtered.filter((feedback) => feedback.event?.id === parseInt(eventFilter));
		}

		// Filter by rating
		if (ratingFilter !== "all") {
			filtered = filtered.filter((feedback) => {
				const rating = Number(feedback.rating) || 0;
				if (ratingFilter === "high") {
					return rating >= 4;
				} else if (ratingFilter === "medium") {
					return rating === 3;
				} else if (ratingFilter === "low") {
					return rating <= 2;
				}
				return true;
			});
		}

		return filtered;
	}, [feedbacks, eventFilter, ratingFilter]);

	// const filteredFeedbacks = feedbacks.filter((p) => {
	// 	const lower = searchFeedback.toLowerCase();
	// 	return p.user?.nama?.toLowerCase().includes(lower);
	// });

	// Fungsi untuk menangani penghapusan kursus
	const handleDelete = (id) => {
		swalDelete().then((result) => {
			if (result.isConfirmed) {
				deleteFeedbackMutation.mutate(id, {
					onSuccess: () => {
						toast.success("Feedback berhasil dihapus.", {
							position: "top-center",
						});
					},
					onError: (err) => {
						// ambil pesan backend kalau ada, fallback ke err.message
						const msg = err?.response?.data?.message || "Gagal menghapus feedback.";
						toast.error(msg, { position: "top-center" });
					},
				}); // Panggil fungsi deleteMutation dengan ID event
			}
		});
	};

	// Handler untuk perubahan halaman dan rows per page
	const handlePageChange = (page) => {
		setCurrentPage(page);
	};

	const handlePerRowsChange = (newPerPage, page) => {
		setRowsPerPage(newPerPage);
		setCurrentPage(page);
	};

	const columns = [
		{
			name: "No",
			cell: (row, index) => index + 1,
			sortable: false,
			width: "60px",
		},
		{
			name: "Nama Partisipan",
			selector: (row) => row.user?.nama || "Anonymous",
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
							<Link to={`/admin/feedbacks/edit/${row.id}`}>
								<MenuItem icon={<EditIcon className="text-yellow-500 hover:text-yellow-600" />}>
									Edit
								</MenuItem>
							</Link>
							<MenuItem
								onClick={() => handleDelete(row.id)}
								disabled={deleteFeedbackMutation.isLoading}
								icon={<Trash className="text-red-500 hover:text-red-600" />}>
								Hapus
							</MenuItem>
						</MenuList>
					</Portal>
				</Menu>
			),
			width: "140px",
		},
	];

	if (feedbacksError) {
		return (
			<div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
				<div className="flex flex-col items-center justify-center  text-gray-600">
					<AlertCircle className="w-12 h-12 text-red-400 mb-4" />
					<h3 className="text-lg font-semibold mb-2">Error</h3>
					<p className="text-gray-500 mb-4 text-center">Gagal mengambil data feedback.</p>
					<p className="text-red-500 mb-4 text-center font-semibold">{feedbacksError.message}</p>
				</div>
			</div>
		);
	}

	return (
		<div className="py-8 page-transition min-h-screen">
			<div className="max-w-6xl mx-auto px-4">
				<div className="bg-white rounded-lg shadow p-6">
					<div className="flex justify-between items-center mb-4">
						<h2 className="text-lg font-semibold">
							{feedbacksRefetching ? (
								<FetchLoader variant="inline" text="Mengambil Data Terbaru..." />
							) : (
								"Daftar Feedback"
							)}
						</h2>
					</div>

					{/* Filter & Search - Always Visible */}
					<div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
						<div>
							<input
								type="text"
								placeholder="Cari partisipan atau event feedback..."
								value={searchFeedback}
								onChange={(e) => setSearchFeedback(e.target.value)}
								className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-emerald-500"
							/>
						</div>
						<div>
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
						<div>
							<select
								value={ratingFilter}
								onChange={(e) => setRatingFilter(e.target.value)}
								className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white">
								<option value="all">Semua Rating</option>
								<option value="high">Rating Tinggi (4-5⭐)</option>
								<option value="medium">Rating Sedang (3⭐)</option>
								<option value="low">Rating Rendah (1-2⭐)</option>
							</select>
						</div>
					</div>

					{feedbacksLoading ? (
						<div className="flex h-96 justify-center py-20">
							<Loader2 className="animate-spin h-7 w-7 text-emerald-600" />
						</div>
					) : (
						<DataTable
							columns={columns}
							data={filteredFeedbacks}
							pagination
							paginationServer
							paginationTotalRows={pagination.total || 0}
							paginationDefaultPage={currentPage}
							onChangePage={handlePageChange}
							onChangeRowsPerPage={handlePerRowsChange}
							paginationPerPage={rowsPerPage}
							paginationRowsPerPageOptions={[10, 20, 30, 50, 100]}
							progressPending={feedbacksRefetching}
							progressComponent={
								<div className="flex justify-center py-10">
									<Loader2 className="animate-spin h-6 w-6 text-emerald-600" />
								</div>
							}
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
					)}
				</div>
			</div>
		</div>
	);
}
