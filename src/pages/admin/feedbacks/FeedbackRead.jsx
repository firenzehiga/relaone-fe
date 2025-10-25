import { useAdminFeedbacks } from "@/_hooks/useFeedbacks";
import {
	ChevronDown,
	Loader2,
	PencilIcon,
	Plus,
	Star,
	Trash,
} from "lucide-react";
import { useMemo, useState } from "react";
import DataTable from "react-data-table-component";
import RatingStars from "@/components/ui/RatingStars";

export default function AdminFeedback() {
	const {
		data: feedbacks,
		isLoading: feedbacksLoading,
		error: feedbacksError,
	} = useAdminFeedbacks();

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
				<div className="flex items-center space-x-2">
					<button className="text-sm text-yellow-600 hover:underline">
						{" "}
						<PencilIcon className="w-4 h-4 mr-2 hover:text-orange-00" />
					</button>
					<button className="text-sm text-red-500 hover:underline">
						{" "}
						<Trash className="w-4 h-4 mr-2 hover:text-red-600" />
					</button>
				</div>
			),
			width: "140px",
		},
	];

	return (
		<div className="py-8 page-transition">
			<div className="max-w-6xl mx-auto px-4">
				<div className="mb-6">
					<h1 className="text-2xl font-bold text-gray-900">
						Admin Feedback List
					</h1>
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
