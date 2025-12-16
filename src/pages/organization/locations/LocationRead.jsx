import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

// UI Libraries
import DataTable from "react-data-table-component";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import {
	ChevronDown,
	Plus,
	Loader2,
	Trash,
	EditIcon,
	EllipsisVerticalIcon,
	AlertCircle,
} from "lucide-react";
import { Menu, MenuButton, MenuList, MenuItem, Portal, IconButton } from "@chakra-ui/react";

// Hooks
import { useOrgDeleteLocationMutation, useOrgLocations } from "@/_hooks/useLocations";

// Helpers
import { getGoogleMapsUrl, parseApiError } from "@/utils";

// UI Components
import FetchLoader from "@/components/ui/FetchLoader";
import { LinkButton } from "@/components/ui/Button";
import { showToast } from "@/components/ui/Toast";
import Badge from "@/components/ui/Badge";
import { useDebounce } from "@/_hooks/useDebounce";

export default function OrganizationLocation() {
	const [searchLocation, setSearchLocation] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const [rowsPerPage, setRowsPerPage] = useState(10);

	// Debounce search menggunakan custom hook
	const debouncedSearch = useDebounce(searchLocation, 500);

	// Reset ke halaman 1 saat search berubah
	useEffect(() => {
		setCurrentPage(1);
	}, [debouncedSearch]);

	const {
		locations,
		pagination,
		isLoading: locationsLoading,
		error: locationsError,
		isFetching: locationsRefetching,
	} = useOrgLocations(currentPage, rowsPerPage, debouncedSearch);

	const deleteLocationMutation = useOrgDeleteLocationMutation();

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
				deleteLocationMutation.mutate(id, {
					onSuccess: () => {
						toast.success("Location berhasil dihapus.", {
							position: "top-center",
						});
					},
					onError: (err) => {
						// ambil pesan backend kalau ada, fallback ke err.message
						const msg = parseApiError(err) || "Gagal menghapus location.";
						showToast({
							type: "error",
							tipIcon: "💡",
							tipText: "Pastikan lokasi tidak terkait dengan data lain.",
							message: msg,
							duration: 3000,
							position: "top-center",
						});
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
			name: "Lokasi",
			selector: (row) => row.nama || "-",
			sortable: true,
			wrap: true,
		},
		{
			name: "Kota",
			selector: (row) => row.kota || "-",
			sortable: false,
			wrap: true,
			width: "200px",
		},
		{
			name: "Provinsi",
			selector: (row) => row.provinsi || "-",
			sortable: false,
			wrap: true,
			width: "200px",
		},
		{
			name: "Tipe",
			selector: (row) => (
				<>
					{row.tipe === "event" ? (
						<Badge variant={"primary"}>Event</Badge>
					) : row.tipe === "organization" ? (
						<Badge variant={"warning"}>Kantor</Badge>
					) : (
						<Badge variant={"secondary"}>Lainnya</Badge>
					)}
				</>
			),
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
							<Link to={`/organization/locations/edit/${row.id}`}>
								<MenuItem icon={<EditIcon className="text-yellow-500 hover:text-yellow-600" />}>
									Edit
								</MenuItem>
							</Link>
							<MenuItem
								onClick={() => handleDelete(row.id)}
								disabled={deleteLocationMutation.isLoading}
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

	if (locationsError) {
		return (
			<div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
				<div className="flex flex-col items-center justify-center  text-gray-600">
					<AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
					<h3 className="text-lg font-semibold mb-2">Error</h3>
					<p className="text-gray-500 mb-4 text-center">Gagal mengambil data lokasi.</p>
					<p className="text-red-500 mb-4 text-center font-semibold">{locationsError.message}</p>
				</div>
			</div>
		);
	}

	return (
		<div className="py-8 bg-emerald-100 page-transition min-h-screen">
			<div className="max-w-6xl mx-auto px-4">
				<div className="bg-white rounded-lg shadow p-6">
					<div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-3">
						<h2 className="text-lg font-semibold">
							{locationsRefetching ? (
								<FetchLoader variant="inline" text="Mengambil Data Terbaru..." />
							) : (
								"Daftar Lokasi"
							)}
						</h2>{" "}
						<LinkButton
							to="/organization/locations/create"
							variant="success"
							size="sm"
							className="w-full md:w-auto">
							<Plus className="w-4 h-4 mr-2" /> Tambah Lokasi
						</LinkButton>
					</div>
					<div className="w-80 mb-4">
						<input
							type="text"
							placeholder="Cari lokasi, kota, atau provinsi..."
							value={searchLocation}
							onChange={(e) => setSearchLocation(e.target.value)}
							className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-emerald-500"
						/>
					</div>
					{locationsLoading ? (
						<div className="flex h-96 justify-center py-20">
							<Loader2 className="animate-spin h-7 w-7 text-emerald-600" />
						</div>
					) : (
						<DataTable
							columns={columns}
							data={locations}
							pagination
							paginationServer
							paginationTotalRows={pagination.total || 0}
							paginationDefaultPage={currentPage}
							onChangePage={handlePageChange}
							onChangeRowsPerPage={handlePerRowsChange}
							paginationPerPage={rowsPerPage}
							paginationRowsPerPageOptions={[10, 20, 30, 50, 100]}
							progressPending={locationsRefetching}
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
							sortIcon={<ChevronDown />}
							expandableRows
							expandableRowsComponent={({ data }) => (
								<div className="p-4 bg-white rounded-md border border-gray-100 shadow-sm">
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<div className="space-y-3">
											<p className="text-sm text-gray-600">
												<strong>Lokasi:</strong> {data.nama || "-"}
											</p>
											<p className="text-sm text-gray-600">
												<strong>Alamat:</strong> {data.alamat || "-"}
											</p>
											<p className="text-sm text-gray-600">
												<strong>Kota:</strong> {data.kota || "-"}
											</p>
											<p className="text-sm text-gray-600">
												<strong>Provinsi:</strong> {data.provinsi || "-"}
											</p>
										</div>
										<div>
											<p className="text-sm text-gray-600">
												<strong>Koordinat Peta:</strong>
											</p>
											<p className="text-sm text-gray-800 mt-1">
												<strong>Lat:</strong> {data.latitude ?? 0} <br />
												<strong>Long:</strong> {data.longitude ?? 0}
											</p>

											<div className="mt-3">
												<a
													href={getGoogleMapsUrl({ location: data })}
													target="_blank"
													rel="noreferrer"
													className="text-sm text-blue-600 hover:underline">
													Buka di Google Maps
												</a>
											</div>
										</div>
										{data.alamat_lengkap && (
											<div className="md:col-span-2">
												<p className="text-sm text-gray-600 mb-1">
													<strong>Alamat Lengkap:</strong>{" "}
												</p>
												<p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
													{data.alamat_lengkap || "-"}
												</p>
											</div>
										)}
									</div>
								</div>
							)}
							noDataComponent={
								<div className="flex flex-col items-center justify-center h-64 text-gray-600">
									<AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
									<h3 className="text-lg font-semibold mb-2">
										{searchLocation ? "No Matching Locations Found" : "No Locations Available"}
									</h3>
									<p className="text-gray-500 mb-4 text-center">
										{searchLocation
											? "Tidak ada lokasi yang sesuai dengan pencarian."
											: "Belum ada data lokasi"}
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
