import { useMemo, useState } from "react";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";
import { toast } from "react-hot-toast";
import {
	useAdminDeleteEventMutation,
	useAdminEvents,
} from "@/_hooks/useEvents";
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
import DynamicButton, { LinkButton } from "@/components/ui/Button";
import { Link } from "react-router-dom";
import { parseApiError } from "@/utils";

export default function AdminEvent() {
	const {
		data: events,
		isLoading: eventsLoading,
		error: eventsError,
	} = useAdminEvents();

	const deleteEventMutation = useAdminDeleteEventMutation();

	// Local state for search/filter
	const [searchEvent, setSearchEvent] = useState("");

	const filteredEvents = useMemo(() => {
		if (!searchEvent) return events;
		const query = searchEvent.toLowerCase();
		return events.filter((eventItem) => {
			const title = String(eventItem.judul || "").toLowerCase();
			const description = String(eventItem.deskripsi || "").toLowerCase();
			const location = String(eventItem.lokasi || "").toLowerCase();
			return (
				title.includes(query) ||
				description.includes(query) ||
				location.includes(query)
			);
		});
	}, [events, searchEvent]);

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
				deleteEventMutation.mutate(id, {
					onSuccess: () => {
						toast.success("Event berhasil dihapus.", {
							position: "top-center",
						});
					},
					onError: (err) => {
						// ambil pesan backend kalau ada, fallback ke err.message
						const msg = parseApiError(err) || "Gagal menghapus event.";
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
			name: "Nama Event",
			selector: (row) => row.judul || "-",
			sortable: true,
			wrap: true,
			width: "300px",
		},
		{
			name: "Organisasi",
			selector: (row) => row.organization?.nama || "-",
			sortable: true,
			width: "220px",
		},
		{
			name: "Deskripsi Singkat",
			selector: (row) => row.deskripsi_singkat,
			sortable: false,
			wrap: true,
		},
		{
			name: "Tanggal",
			selector: (row) =>
				row.tanggal_mulai
					? new Date(row.tanggal_mulai.replace(" ", "T")).toLocaleDateString(
							"id-ID",
							{
								day: "numeric",
								month: "long",
								year: "numeric",
							}
					  )
					: "-",
			sortable: true,
			width: "150px",
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
								disabled={deleteEventMutation.isLoading}
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
					<h1 className="text-2xl font-bold text-gray-900">Data Event</h1>
					<p className="text-gray-600">Kelola data event di sini</p>
				</div>

				<div className="bg-white rounded-lg shadow p-6">
					<div className="flex justify-between items-center mb-4">
						<h2 className="text-lg font-semibold">Daftar Event</h2>
						<LinkButton variant="success" to="/admin/events/create">
							<Plus className="w-4 h-4 mr-2" /> Tambah Event
						</LinkButton>
					</div>

					{eventsLoading ? (
						<div className="flex h-96 justify-center py-20">
							{" "}
							<Loader2 className="animate-spin h-7 w-7 text-emerald-600" />
						</div>
					) : eventsError ? (
						<div className="text-red-600">
							Error loading events: {eventsError.message}
						</div>
					) : events.length === 0 ? (
						<div className="flex flex-col items-center justify-center h-48 text-gray-600">
							<h3 className="text-lg font-semibold mb-2">
								No Events Available
							</h3>
							<p className="text-gray-500">Belum ada data event.</p>
						</div>
					) : (
						<>
							<div className="w-80 mb-4">
								<input
									type="text"
									placeholder="Cari judul, deskripsi, atau lokasi..."
									value={searchEvent}
									onChange={(e) => setSearchEvent(e.target.value)}
									className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-emerald-500"
								/>
							</div>
							<DataTable
								columns={columns}
								data={filteredEvents}
								pagination
								pointerOnHover
								title=""
								highlightOnHover
								persistTableHead
								responsive
								striped
								sortIcon={<ChevronDown />}
								expandableRows
								expandableRowsComponent={({ data }) => (
									<div className="p-4 bg-gray-50 rounded-md">
										<p className="text-sm text-gray-600">
											<strong>Judul:</strong> {data.judul || "-"}
										</p>
										<p className="text-sm text-gray-600 mt-2">
											<strong>Deskripsi:</strong>
										</p>
										<p className="text-sm text-gray-800 mt-1">
											{data.deskripsi || "-"}
										</p>
										{data.lokasi && (
											<p className="text-sm text-gray-600 mt-2">
												<strong>Lokasi:</strong> {data.lokasi}
											</p>
										)}
									</div>
								)}
							/>
						</>
					)}
				</div>
			</div>
		</div>
	);
}
