import { useEffect, useMemo, useState } from "react";
import DataTable from "react-data-table-component";
import { swalDelete } from "@/components/ui/Swal";
import { toast } from "react-hot-toast";
import {
	useAdminBulkDeleteEvents,
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
	AlertCircle,
	XCircle,
} from "lucide-react";
import { Menu, MenuButton, MenuList, MenuItem, Portal, IconButton } from "@chakra-ui/react";
import Button, { LinkButton } from "@/components/ui/DynamicButton";
import { Link } from "react-router-dom";
import { getImageUrl, parseApiError } from "@/utils";
import { formatDate, formatTime } from "@/utils/dateFormatter";
import FetchLoader from "@/components/ui/FetchLoader";
import Badge from "@/components/ui/Badge";
import { useAuthStore } from "@/_hooks/useAuth";
import { useDebounce } from "@/_hooks/utils/useDebounce";
import { AsyncImage } from "loadable-image";
import { Fade } from "transitions-kit";
import ExportData from "@/components/ui/ExportData";

export default function AdminEvent() {
	const [searchEvent, setSearchEvent] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const [rowsPerPage, setRowsPerPage] = useState(10);

	const [previewImg, setPreviewImg] = useState(null);

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

	// bulk delete mutation + selected rows
	const bulkDeleteMutation = useAdminBulkDeleteEvents();
	const { isLoading } = useAuthStore();

	const [selectedRows, setSelectedRows] = useState([]);
	const [clearSelectedRows, setClearSelectedRows] = useState(false);

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
		swalDelete().then((result) => {
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

	const handleSelectedRowsChange = ({ selectedRows }) => {
		setSelectedRows(selectedRows || []);
	};

	const handleBulkDelete = () => {
		if (!selectedRows || selectedRows.length === 0) return;

		swalDelete().then((result) => {
			if (result.isConfirmed) {
				const ids = selectedRows.map((r) => r.id);
				bulkDeleteMutation.mutateAsync(ids, {
					onSuccess: () => {
						// clear selection and refetch handled by onSuccess invalidation
						setSelectedRows([]);
						setClearSelectedRows((s) => !s);
					},
				});
			}
		});
	};

	const columns = [
		{
			name: "No",
			cell: (row, index) => index + 1,
			sortable: false,
			width: "50px",
		},
		{
			name: "Nama Event",
			selector: (row) => row.judul || "-",
			sortable: true,
			wrap: true,
			width: "350px",
		},
		{
			name: "Banner",
			selector: (row) => (
				<div className="flex items-center justify-center p-1">
					<AsyncImage
						src={getImageUrl(`events/${row.gambar}`)}
						alt={row.judul}
						className="h-16 w-16 object-cover rounded-lg border border-gray-200 bg-gray-50 shadow-sm hover:scale-105 transition-transform duration-200 cursor-pointer"
						onClick={() => setPreviewImg(getImageUrl(`events/${row.gambar}`))}
					/>
				</div>
			),
			sortable: true,
			width: "150px",
		},
		{
			name: "Kategori",
			selector: (row) => <Badge color={row.category?.warna}>{row.category?.nama}</Badge> || "-",
			sortable: false,
			wrap: true,
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
			width: "130px",
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
						<div className="flex gap-2 w-full md:w-auto">
							<LinkButton variant="success" to="/admin/events/create" className="w-full md:w-auto">
								<Plus className="w-4 h-4 mr-2" /> Tambah Kegiatan
							</LinkButton>
						</div>
					</div>
					{/* Filter & Search */}
					<div className="w-full mb-4 flex flex-col md:flex-row md:items-center gap-2">
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
						{selectedRows && selectedRows.length > 0 && (
							<div className="flex w-full md:w-auto">
								<Button
									variant="danger"
									size="sm"
									loading={isLoading}
									onClick={handleBulkDelete}
									disabled={
										!selectedRows || selectedRows.length === 0 || bulkDeleteMutation.isLoading
									}
									className="w-full md:w-auto">
									{isLoading ? null : (
										<>
											<Trash className="w-4 h-4 mr-2" />
										</>
									)}
									Hapus Terpilih ({selectedRows.length})
								</Button>
							</div>
						)}
						{/* Export CSV seluruh peserta */}
						<ExportData
							data={filteredEvents.map((p, index) => ({
								no: index + 1,
								judul: p.judul || "",
								kategori: p.category?.nama || "",
								status: p.status || "",
								tanggal_mulai: formatDate(p.tanggal_mulai) || "",
								tanggal_selesai: formatDate(p.tanggal_selesai) || "",
								waktu_mulai: formatTime(p.waktu_mulai) || "",
								waktu_selesai: formatTime(p.waktu_selesai) || "",
								lokasi: p.location?.nama || "",
								organisasi: p.organization?.nama || "",
								maks_peserta: p.maks_peserta || 0,
								peserta_saat_ini: p.peserta_saat_ini || 0,
								deskripsi_singkat: p.deskripsi_singkat || "",
								deskripsi: p.deskripsi || "",
							}))}
							filename="events"
							buttonText="Export CSV"
							variant="success"
							disabled={eventsLoading || !filteredEvents || filteredEvents.length === 0}
							className="w-full md:w-auto"
						/>
					</div>
					{eventsLoading ? (
						<div className="flex h-96 justify-center py-20">
							<Loader2 className="animate-spin h-7 w-7 text-emerald-600" />
						</div>
					) : (
						<DataTable
							columns={columns}
							data={filteredEvents}
							onSelectedRowsChange={handleSelectedRowsChange}
							clearSelectedRows={clearSelectedRows}
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
							selectableRows={true}
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
										<div className="text-sm font-semibold text-gray-700 mb-1">
											Deskripsi Singkat:
										</div>
										<div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
											{data.deskripsi_singkat || "-"}
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
			{previewImg && (
				<Portal>
					<div
						className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
						onClick={() => setPreviewImg(null)}>
						<div
							className="relative bg-transparent p-4 rounded"
							onClick={(e) => e.stopPropagation()}>
							<button
								aria-label="Close preview"
								onClick={() => setPreviewImg(null)}
								className="absolute -top-3 -right-3 bg-white rounded-full p-1 shadow hover:bg-gray-100 focus:outline-none">
								<XCircle className="w-7 h-7 text-red-700" />
							</button>
							<div className="bg-white rounded-lg shadow-lg p-3 max-w-[92vw] max-h-[86vh] flex items-center justify-center">
								<img
									src={previewImg}
									alt="Preview"
									className="max-w-full max-h-[80vh] object-contain rounded-lg"
									onError={(e) => {
										e.target.onerror = null;
										e.target.src = "https://placehold.co/800x600?text=No+Image";
									}}
								/>
							</div>
						</div>
					</div>
				</Portal>
			)}
		</div>
	);
}
