import { useEffect, useMemo, useState } from "react";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";
import { toast } from "react-hot-toast";
import { useAdminDeleteEventMutation, useAdminEvents } from "@/_hooks/useEvents";
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
import DynamicButton, { LinkButton } from "@/components/ui/Button";
import { Link } from "react-router-dom";
import { getImageUrl, parseApiError } from "@/utils";
import { formatDate, formatTime } from "@/utils/dateFormatter";
import FetchLoader from "@/components/ui/FetchLoader";
import Badge from "@/components/ui/Badge";
import { useAuthStore } from "@/_hooks/useAuth";
import { useDebounce } from "@/_hooks/useDebounce";

export default function AdminEvent() {
	const [searchEvent, setSearchEvent] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const [rowsPerPage, setRowsPerPage] = useState(10);

	// Debounce search menggunakan custom hook
	const debouncedSearch = useDebounce(searchEvent, 500); // You can implement debounce if needed

	// Reset ke halaman 1 saat search berubah
	useEffect(() => {
		setCurrentPage(1);
	}, [debouncedSearch]);

	const {
		events,
		pagination,
		isLoading: eventsLoading,
		error: eventsError,
		isFetching: eventsRefetching,
	} = useAdminEvents(currentPage, rowsPerPage, debouncedSearch);

	const deleteEventMutation = useAdminDeleteEventMutation();

	const { isLoading } = useAuthStore();
	// Local state for search/filter
	const [statusFilter, setStatusFilter] = useState("all");
	const [organizationFilter, setOrganizationFilter] = useState("all");

	// Get unique organizations
	const organizationsList = useMemo(() => {
		const orgsMap = new Map();
		events.forEach((event) => {
			if (event.organization?.id && event.organization?.nama) {
				orgsMap.set(event.organization.id, {
					id: event.organization.id,
					nama: event.organization.nama,
				});
			}
		});
		return Array.from(orgsMap.values()).sort((a, b) => a.nama.localeCompare(b.nama));
	}, [events]);

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
				}
				return true;
			});
		}

		// Filter by organization
		if (organizationFilter !== "all") {
			filtered = filtered.filter(
				(event) => event.organization?.id === parseInt(organizationFilter)
			);
		}

		return filtered;
	}, [events, searchEvent, statusFilter, organizationFilter]);

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
			name: "Nama Event",
			selector: (row) => row.judul || "-",
			sortable: true,
			wrap: true,
			width: "250px",
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
			width: "120px",
		},
		{
			name: "Deskripsi Singkat",
			selector: (row) => row.deskripsi_singkat,
			sortable: false,
			wrap: true,
			width: "230px",
		},
		{
			name: "Kategori",
			selector: (row) => row.category?.nama || "-",
			sortable: false,
			wrap: true,
			width: "110px",
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
			width: "120px",
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
								<Link to={`/admin/events/edit/${row.id}`}>
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
			width: "140px",
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
		<div className="py-8 page-transition min-h-screen">
			<div className="max-w-6xl mx-auto px-4">
				<div className="bg-white rounded-lg shadow p-6">
					<div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-3">
						<h2 className="text-lg font-semibold">
							{eventsRefetching ? (
								<FetchLoader variant="inline" text="Mengambil Data Terbaru..." />
							) : (
								"Daftar Kegiatan"
							)}
						</h2>
						<LinkButton variant="success" to="/admin/events/create" className="w-full md:w-auto">
							<Plus className="w-4 h-4 mr-2" /> Tambah Kegiatan
						</LinkButton>
					</div>
					{/* Filter & Search */}
					<div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
						<div>
							<input
								type="text"
								placeholder="Cari judul, deskripsi, atau lokasi..."
								value={searchEvent}
								onChange={(e) => setSearchEvent(e.target.value)}
								className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-emerald-500"
							/>
						</div>
						<div>
							<select
								value={statusFilter}
								onChange={(e) => setStatusFilter(e.target.value)}
								className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white">
								<option value="all">Semua Status</option>
								<option value="upcoming">Belum Mulai</option>
								<option value="ongoing">Sedang Berlangsung</option>
								<option value="completed">Sudah Selesai</option>
							</select>
						</div>
						<div>
							<select
								value={organizationFilter}
								onChange={(e) => setOrganizationFilter(e.target.value)}
								className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white">
								<option value="all">Semua Organisasi</option>
								{organizationsList.map((org) => (
									<option key={org.id} value={org.id}>
										{org.nama}
									</option>
								))}
							</select>
						</div>
					</div>
					{eventsLoading ? (
						<div className="flex h-96 justify-center py-20">
							<Loader2 className="animate-spin h-7 w-7 text-emerald-600" />
						</div>
					) : (
						<DataTable
							columns={columns}
							data={filteredEvents}
							pagination
							paginationServer
							paginationTotalRows={pagination.total || 0}
							paginationDefaultPage={currentPage}
							onChangePage={handlePageChange}
							onChangeRowsPerPage={handlePerRowsChange}
							paginationPerPage={rowsPerPage}
							paginationRowsPerPageOptions={[10, 20, 30, 50, 100]}
							progressPending={eventsRefetching}
							progressComponent={
								<div className="flex justify-center py-10">
									<Loader2 className="animate-spin h-6 w-6 text-emerald-600" />
								</div>
							}
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
												<span className="font-semibold">Organisasi:</span>
												<span className="ml-2 text-gray-900">{data.organization?.nama || "-"}</span>
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
													{formatDate(data.tanggal_selesai) || "-"}
												</div>
											</div>
											<div className="flex items-start">
												<div className="text-sm text-gray-700 font-semibold">Waktu:</div>
												<div className="text-sm ml-2">
													{formatTime(data.waktu_mulai) || "-"} -{" "}
													{formatTime(data.waktu_selesai) || "-"} WIB
												</div>
											</div>
											<div className="flex items-start">
												<div className="text-sm text-gray-700 font-semibold">Jumlah Perserta:</div>
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
										{searchEvent ? "No Matching Events Found" : "No Events Available"}
									</h3>
									<p className="text-gray-500 mb-4 text-center">
										{searchEvent
											? "Tidak ada event yang sesuai dengan pencarian."
											: "Belum ada data event"}
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
