import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

// UI Libraries
import DataTable from "react-data-table-component";
import { toast } from "react-hot-toast";
import Swal from "sweetalert2";
import {
	ChevronDown,
	Plus,
	Loader2,
	Trash,
	Eye,
	EditIcon,
	EllipsisVerticalIcon,
	AlertCircle,
	Play,
	CheckCircle,
	XCircle,
} from "lucide-react";
import { Menu, MenuButton, MenuList, MenuItem, Portal, IconButton } from "@chakra-ui/react";

// Hooks / Stores
import { useAuthStore } from "@/_hooks/useAuth";
import {
	useOrgDeleteEventMutation,
	useOrgEvents,
	useOrgStartEventMutation,
	useOrgCompleteEventMutation,
	useOrgCancelEventMutation,
} from "@/_hooks/useEvents";

// Helpers
import { formatDate, formatTime } from "@/utils/dateFormatter";
import { getImageUrl, parseApiError } from "@/utils";

// UI Components
import FetchLoader from "@/components/ui/FetchLoader";
import { LinkButton } from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";

export default function OrganizationEvent() {
	const {
		data: events = [],
		isLoading: eventsLoading,
		error: eventsError,
		isFetching: eventsRefetching,
	} = useOrgEvents();

	const deleteEventMutation = useOrgDeleteEventMutation();
	const startEventMutation = useOrgStartEventMutation();
	const completeEventMutation = useOrgCompleteEventMutation();
	const cancelEventMutation = useOrgCancelEventMutation();

	const { isLoading } = useAuthStore();

	// Local state for search/filter
	const [searchEvent, setSearchEvent] = useState("");
	const [statusFilter, setStatusFilter] = useState("all"); // all, upcoming, ongoing, completed

	const filteredEvents = useMemo(() => {
		let filtered = events;

		// Filter by status
		if (statusFilter !== "all") {
			const today = new Date();
			today.setHours(0, 0, 0, 0);

			filtered = filtered.filter((eventItem) => {
				const startDate = new Date(`${eventItem.tanggal_mulai}T${eventItem.waktu_mulai}`);
				const endDate = new Date(`${eventItem.tanggal_selesai}T${eventItem.waktu_selesai}`);

				if (statusFilter === "upcoming") {
					return startDate > today;
				} else if (statusFilter === "ongoing") {
					return startDate <= today && endDate >= today;
				} else if (statusFilter === "completed") {
					return endDate < today;
				} else if (statusFilter === "cancelled") {
					return eventItem.status === "cancelled";
				}
				return true;
			});
		}

		// Filter by search query
		if (searchEvent) {
			const query = searchEvent.toLowerCase();
			filtered = filtered.filter((eventItem) => {
				const title = String(eventItem.judul || "").toLowerCase();
				const description = String(eventItem.deskripsi || "").toLowerCase();
				const location = String(eventItem.lokasi || "").toLowerCase();
				return title.includes(query) || description.includes(query) || location.includes(query);
			});
		}

		return filtered;
	}, [events, searchEvent, statusFilter]);

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

	const canStart = (row) => {
		if (!row || row.status !== "published" || !row.tanggal_mulai) return false;
		const start = new Date(`${row.tanggal_mulai}T${row.waktu_mulai}`); // gabungan tanggal & waktu mulai contoh Tue Nov 18 2025 20:28:00 GMT+0700 (Western Indonesia Time)}
		if (!start) return false; // langsung keliatan kalau parsing gagal
		return Date.now() >= start.getTime();
	};

	const canComplete = (row) => {
		if (!row || row.status !== "ongoing" || !row.tanggal_selesai) return false;
		const end = new Date(`${row.tanggal_selesai}T${row.waktu_selesai}`); // gabungan tanggal & waktu mulai contoh Tue Nov 18 2025 20:28:00 GMT+0700 (Western Indonesia Time)}
		if (!end) return false;
		return Date.now() >= end.getTime();
	};

	const canCancel = (row) => {
		if (!row) return false;
		// di backend meelarang membatalkan event yang sudah selesai, dibatalkan, draft, atau sedang berlangsung
		return !["completed", "cancelled", "ongoing", "draft"].includes(row.status);
	};

	const handleStart = (row) => {
		Swal.fire({
			title: "Mulai event?",
			text: "Aksi ini akan mengubah status event menjadi 'ongoing'. Lanjutkan?",
			showCancelButton: true,
			confirmButtonText: "Ya, mulai",
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
		}).then((result) => {
			if (result.isConfirmed) {
				startEventMutation.mutate(row.id);
			}
		});
	};

	const handleComplete = (row) => {
		Swal.fire({
			title: "Selesaikan event?",
			text: "Aksi ini akan mengubah status event menjadi 'completed' dan menandai peserta yang belum hadir.",
			showCancelButton: true,
			confirmButtonText: "Ya, selesaikan",
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
		}).then((result) => {
			if (result.isConfirmed) {
				completeEventMutation.mutate(row.id);
			}
		});
	};

	const handleCancel = (row) => {
		Swal.fire({
			title: "Batalkan event?",
			text: "Masukkan alasan pembatalan (opsional).",
			input: "textarea",
			inputPlaceholder: "Alasan pembatalan...",
			showCancelButton: true,
			confirmButtonText: "Ya, batalkan",
			cancelButtonText: "Batal",
			customClass: {
				popup: "bg-white rounded-xl shadow-xl p-5 max-w-md w-full",
				title: "text-lg font-semibold text-gray-900",
				content: "text-sm text-gray-600 dark:text-gray-300 mt-1",
				actions: "flex gap-3 justify-center mt-4",
				confirmButton:
					"px-4 py-2 focus:outline-none rounded-md bg-red-500 hover:bg-red-600 text-white",
				cancelButton:
					"px-4 py-2 rounded-md border border-gray-300 bg-gray-200 hover:bg-gray-300 text-gray-700",
			},
		}).then((result) => {
			if (result.isConfirmed) {
				const reason = result.value || null;
				cancelEventMutation.mutate({ id: row.id, data: { reason } });
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
			name: "Banner",
			selector: (row) => (
				<div className="flex items-center mt-1 mb-1">
					{row.gambar ? (
						<img
							src={getImageUrl(`events/${row.gambar}`)}
							alt={row.nama || "Banner"}
							className="w-16 h-16 rounded-md object-cover border border-gray-200"
						/>
					) : (
						<div className="w-16 h-16 rounded-md bg-gray-100 flex items-center justify-center text-xs text-gray-500 border border-gray-200">
							No Image
						</div>
					)}
				</div>
			),
			sortable: true,
			width: "100px",
		},
		{
			name: "Batas Pendaftaran",
			selector: (row) => formatDate(row.batas_pendaftaran || "-"),
			sortable: false,
			width: "200px",
		},
		{
			name: "Kategori",
			selector: (row) => row.category?.nama || "-",
			sortable: false,
			width: "150px",
		},
		{
			name: "Status",
			selector: (row) => (
				<>
					{row.status === "draft" ? (
						<Badge variant={"default"}>Draft</Badge>
					) : row.status === "published" ? (
						<Badge variant={"primary"}>Published</Badge>
					) : row.status === "ongoing" ? (
						<Badge variant={"warning"}>Ongoing</Badge>
					) : row.status === "completed" ? (
						<Badge variant={"success"}>Completed</Badge>
					) : (
						<Badge variant={"danger"}>Cancelled</Badge>
					)}
				</>
			),
			sortable: false,
			width: "110px",
		},

		{
			name: "Aksi",
			cell: (row) => {
				if (isLoading) {
					return <Loader2 className="animate-spin h-5 w-5 text-emerald-600" />;
				}
				return (
					<Menu>
						<MenuButton
							as={IconButton}
							aria-label="Options"
							icon={<EllipsisVerticalIcon />}
							variant="ghost"
						/>
						<Portal>
							<MenuList className="font-semibold">
								{canStart(row) && (
									<MenuItem
										onClick={() => handleStart(row)}
										disabled={startEventMutation.isLoading}
										icon={<Play className="text-emerald-500 hover:text-emerald-600" />}>
										Mulai Kegiatan
									</MenuItem>
								)}
								{canComplete(row) && (
									<MenuItem
										onClick={() => handleComplete(row)}
										disabled={completeEventMutation.isLoading}
										icon={<CheckCircle className="text-emerald-500 hover:text-emerald-600" />}>
										Selesaikan
									</MenuItem>
								)}
								{canCancel(row) && (
									<MenuItem
										onClick={() => handleCancel(row)}
										disabled={cancelEventMutation.isLoading}
										icon={<XCircle className="text-red-500 hover:text-red-600" />}>
										Batalkan
									</MenuItem>
								)}
								<Link to={`/organization/events/edit/${row.id}`}>
									<MenuItem icon={<EditIcon className="text-yellow-500 hover:text-yellow-600" />}>
										Edit
									</MenuItem>
								</Link>
								<MenuItem
									onClick={() => handleDelete(row.id)}
									disabled={deleteEventMutation.isLoading}
									icon={<Trash className="text-red-500 hover:text-red-600" />}>
									Hapus
								</MenuItem>
							</MenuList>
						</Portal>
					</Menu>
				);
			},
			wrap: true,
		},
	];

	if (eventsError) {
		return (
			<div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
				<div className="flex flex-col items-center justify-center  text-gray-600">
					<AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
					<h3 className="text-lg font-semibold mb-2">Error</h3>
					<p className="text-gray-500 mb-4 text-center">Gagal mengambil data event.</p>
					<p className="text-red-500 mb-4 text-center font-semibold">{eventsError.message}</p>
				</div>
			</div>
		);
	}

	return (
		<div className="py-8 bg-emerald-100 page-transition min-h-screen">
			<div className="max-w-6xl mx-auto px-4">
				<div className="bg-white rounded-xl shadow p-6">
					<div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-3">
						<h2 className="text-lg font-semibold">Daftar Event/Kegiatan</h2>
						<LinkButton
							variant="success"
							to="/organization/events/create"
							className="w-full md:w-auto">
							<Plus className="w-4 h-4 mr-2" /> Tambah Event
						</LinkButton>
					</div>

					{eventsLoading ? (
						<div className="flex h-96 justify-center py-20">
							{" "}
							<Loader2 className="animate-spin h-7 w-7 text-emerald-600" />
						</div>
					) : (
						<>
							{eventsRefetching && <FetchLoader />}

							{/* Filter & Search */}
							<div className="flex flex-col sm:flex-row gap-3 mb-4">
								<div className="flex-1 max-w-md">
									<input
										type="text"
										placeholder="Cari judul, deskripsi, atau lokasi..."
										value={searchEvent}
										onChange={(e) => setSearchEvent(e.target.value)}
										className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-emerald-500"
									/>
								</div>
								<div className="w-full sm:w-48">
									<select
										value={statusFilter}
										onChange={(e) => setStatusFilter(e.target.value)}
										className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white">
										<option value="all">Semua Status</option>
										<option value="cancelled">Dibatalkan</option>
										<option value="upcoming">Belum Mulai</option>
										<option value="ongoing">Sedang Berlangsung</option>
										<option value="completed">Sudah Selesai</option>
									</select>
								</div>
							</div>
							<DataTable
								columns={columns}
								data={filteredEvents}
								pagination
								pointerOnHover
								title=""
								fixedHeader
								highlightOnHover
								persistTableHead
								responsive
								striped
								sortIcon={<ChevronDown />}
								expandableRows
								expandableRowsComponent={({ data }) => (
									<div className="p-6 bg-white rounded-md border border-gray-100 shadow-sm">
										<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
											{/* Left column */}
											<div className="space-y-3">
												<div className="text-sm text-gray-700">
													<span className="font-semibold">Judul:</span>
													<span className="ml-2 text-gray-900">{data.judul || "-"}</span>
												</div>
												<div className="text-sm text-gray-700">
													<span className="font-semibold">Lokasi:</span>
													<span className="ml-2 text-gray-900">{data.location?.nama || "-"}</span>
												</div>
												<div className="text-sm text-gray-700">
													<span className="font-semibold">Alamat:</span>
													<span className="ml-2 text-gray-900">{data.location?.alamat || "-"}</span>
												</div>
											</div>

											{/* Right column */}
											<div className="space-y-3">
												<div className="flex items-start">
													<div className="text-sm text-gray-700 font-semibold">Tanggal:</div>
													<div className="text-sm text-gray-900 ml-2">
														{formatDate(data.tanggal_mulai) || "-"} -{" "}
														{formatDate(data.tanggal_selesai) || "-"} WIB
													</div>
												</div>
												<div className="flex items-start">
													<div className="text-sm text-gray-700 font-semibold">Waktu:</div>
													<div className="text-sm ml-2">
														{formatTime(data.waktu_mulai) || "-"} -{" "}
														{formatTime(data.waktu_selesai) || "-"}
													</div>
												</div>
												<div className="flex items-start">
													<div className="text-sm text-gray-700 font-semibold">
														Jumlah Perserta:
													</div>
													<div className="text-sm ml-2">
														{data.peserta_saat_ini || 0} / {data.maks_peserta || 0} Peserta
													</div>
												</div>
											</div>
										</div>
										<div className="mt-4">
											<div className="text-sm font-semibold text-gray-700 mb-1">Deskripsi:</div>
											<div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
												{data.deskripsi || "-"}
											</div>
										</div>
									</div>
								)}
								noDataComponent={
									<div className="flex flex-col items-center justify-center h-64 text-gray-600">
										<AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
										<h3 className="text-lg font-semibold mb-2">
											{searchEvent || statusFilter
												? "No Matching Events Found"
												: "No Events Available"}
										</h3>
										<p className="text-gray-500 mb-4 text-center">
											{searchEvent || statusFilter
												? "Tidak ada event yang sesuai dengan pencarian."
												: "Belum ada data event"}
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
