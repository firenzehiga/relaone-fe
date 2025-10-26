import {
	useAdminDeleteFeedbackMutation,
	useAdminFeedbacks,
} from "@/_hooks/useFeedbacks";
import {
	ChevronDown,
	Plus,
	Loader2,
	Trash,
	Eye,
	EditIcon,
	EllipsisVerticalIcon,
} from "lucide-react";
import {
	Menu,
	MenuButton,
	MenuList,
	MenuItem,
	Portal,
	IconButton,
} from "@chakra-ui/react";
import Swal from "sweetalert2";
import { toast } from "react-hot-toast";
import { useMemo, useState } from "react";
import DataTable from "react-data-table-component";
import RatingStars from "@/components/ui/RatingStars";

export default function AdminFeedback() {
	const {
		data: feedbacks,
		isLoading: feedbacksLoading,
		error: feedbacksError,
	} = useAdminFeedbacks();

	const deleteFeedbackMutation = useAdminDeleteFeedbackMutation();
	// Local state for search/filter
	const [searchFeedback, setSearchFeedback] = useState("");

	const filteredFeedbacks = useMemo(() => {
		if (!searchFeedback) return feedbacks;
		const query = searchFeedback.toLowerCase();
		return feedbacks.filter((feedbackItem) => {
			const user = String(feedbackItem.user?.nama || "").toLowerCase();
			const event = String(feedbackItem.event?.judul || "").toLowerCase();
			return user.includes(query) || event.includes(query);
		});
	}, [feedbacks, searchFeedback]);

	// Fungsi untuk menangani penghapusan kursus
	const handleDelete = (id) => {
		Swal.fire({
			title: "Apa Anda yakin?",
			text: "Kamu tidak akan bisa mengembalikan ini!",
			showCancelButton: true,
			confirmButtonText: "Ya, hapus!",
			cancelButtonText: "Batal",
			customClass: {
				popup: "bg-white rounded-xl shadow-xl p-5 max-w-md w-full",
				title: "text-lg font-semibold text-gray-900",
				content: "text-sm text-gray-600 dark:text-gray-300 mt-1",
				actions: "flex gap-3 justify-center mt-4",
				confirmButton:
					"px-4 py-2 focus:outline-none rounded-md bg-emerald-500 hover:bg-emerald-600 text-white",
				cancelButton:
					"px-4 py-2 rounded-md border border-gray-300 bg-gray-200 hover:bg-gray-300 text-gray-700",
			},
			backdrop: true,
		}).then((result) => {
			if (result.isConfirmed) {
				deleteFeedbackMutation.mutate(id, {
					onSuccess: () => {
						toast.success("Feedback berhasil dihapus.", {
							position: "top-center",
						});
					},
					onError: (err) => {
						// ambil pesan backend kalau ada, fallback ke err.message
						const msg =
							err?.response?.data?.message || "Gagal menghapus feedback.";
						toast.error(msg, { position: "top-center" });
					},
				}); // Panggil fungsi deleteMutation dengan ID event
			}
		});
	};

	const columns = [
		{
			name: "No",
			cell: (row, index) => index + 1,
			sortable: false,
			width: "60px",
		},
		{
			name: "Nama User",
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
				return (
					<RatingStars
						rating={rating}
						maxRating={5}
						size="sm"
						interactive={false}
					/>
				);
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
							<MenuItem
								icon={<Eye className="text-blue-500 hover:text-blue-600" />}>
								Lihat
							</MenuItem>
							<MenuItem
								icon={
									<EditIcon className="text-yellow-500 hover:text-yellow-600" />
								}>
								Edit
							</MenuItem>
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

	return (
		<div className="py-8 page-transition">
			<div className="max-w-6xl mx-auto px-4">
				<div className="mb-6">
					<h1 className="text-2xl font-bold text-gray-900">Data Feedback</h1>
					<p className="text-gray-600">Kelola data feedback di sini</p>
				</div>

				<div className="bg-white rounded-lg shadow p-6">
					<div className="flex justify-between items-center mb-4">
						<h2 className="text-lg font-semibold">Daftar Feedback</h2>
					</div>

					{feedbacksLoading ? (
						<div className="flex h-96 justify-center py-20">
							{" "}
							<Loader2 className="animate-spin h-7 w-7 text-emerald-600" />
						</div>
					) : feedbacksError ? (
						<div className="text-red-600">
							Error loading feedbacks: {feedbacksError.message}
						</div>
					) : feedbacks.length === 0 ? (
						<div className="flex flex-col items-center justify-center h-48 text-gray-600">
							<h3 className="text-lg font-semibold mb-2">
								No feedback Available
							</h3>
							<p className="text-gray-500">Belum ada data feedback.</p>
						</div>
					) : (
						<>
							<div className="w-80 mb-4">
								<input
									type="text"
									placeholder="Cari user atau event feedback..."
									value={searchFeedback}
									onChange={(e) => setSearchFeedback(e.target.value)}
									className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-emerald-500"
								/>
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
							/>
						</>
					)}
				</div>
			</div>
		</div>
	);
}
