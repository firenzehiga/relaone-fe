import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import {
	ChevronDown,
	Plus,
	Loader2,
	Trash,
	EditIcon,
	EllipsisVerticalIcon,
	AlertCircle,
	Star,
} from "lucide-react";
import { Menu, MenuButton, MenuList, MenuItem, Portal, IconButton } from "@chakra-ui/react";
import Button, { LinkButton } from "@/components/ui/Button";
import { swalDelete, swalWarning } from "@/components/ui/Swal";
import { showToast } from "@/components/ui/Toast";
import {
	useAdminBulkDeleteOrganizations,
	useAdminDeleteOrganizationMutation,
	useAdminOrganizations,
} from "@/_hooks/useOrganizations";
import Badge from "@/components/ui/Badge";
import { getImageUrl, parseApiError } from "@/utils";
import { Link } from "react-router-dom";
import FetchLoader from "@/components/ui/FetchLoader";
import toast from "react-hot-toast";
import { AsyncImage } from "loadable-image";
import { Fade } from "transitions-kit";
import RatingStars from "@/components/ui/RatingStars";
import { useAdminUpdateOrganizationRatingsMutation } from "@/_hooks/useUsers";
import { useAuthStore } from "@/_hooks/useAuth";
import { useDebounce } from "@/_hooks/utils/useDebounce";

export default function AdminOrganization() {
	const [searchOrganization, setSearchOrganization] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const [rowsPerPage, setRowsPerPage] = useState(10);

	// Debounce search menggunakan custom hook
	const debouncedSearch = useDebounce(searchOrganization, 500); // You can implement debounce if needed

	// Reset ke halaman 1 saat search berubah
	useEffect(() => {
		setCurrentPage(1);
	}, [debouncedSearch]);

	const {
		organizations,
		pagination,
		isLoading: organizationsLoading,
		error: organizationsError,
		isFetching: organizationsRefetching,
	} = useAdminOrganizations(currentPage, rowsPerPage, debouncedSearch);

	const deleteOrganizationMutation = useAdminDeleteOrganizationMutation();
	// bulk delete
	const bulkDeleteMutation = useAdminBulkDeleteOrganizations();
	const [selectedRows, setSelectedRows] = useState([]);
	const [clearSelectedRows, setClearSelectedRows] = useState(false);

	const { isLoading } = useAuthStore();

	const updateOrganizationRatingsMutation = useAdminUpdateOrganizationRatingsMutation();

	// Fungsi untuk menangani penghapusan kursus
	const handleDelete = (id) => {
		swalDelete().then((result) => {
			if (result.isConfirmed) {
				deleteOrganizationMutation.mutate(id, {
					onSuccess: () => {
						toast.success("Organisasi berhasil dihapus.", {
							position: "top-center",
						});
					},
					onError: (err) => {
						// ambil pesan backend kalau ada, fallback ke err.message
						const msg = parseApiError(err) || "Terjadi kesalahan";
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

	const handleSelectedRowsChange = ({ selectedRows }) => {
		setSelectedRows(selectedRows || []);
	};

	const handleBulkDelete = async () => {
		if (!selectedRows || selectedRows.length === 0) return;

		swalDelete().then(async (result) => {
			if (!result.isConfirmed) return;
			const ids = selectedRows.map((r) => r.id);
			if (result.isConfirmed) {
				bulkDeleteMutation.mutateAsync(ids);
				setSelectedRows([]);
				setClearSelectedRows((s) => !s);
			}
		});
	};

	// Fungsi untuk menangani pembaruan rating organisasi
	const handleUpdateRatings = (id) => {
		swalWarning({
			title: "Lanjutkan pembaruan rating organisasi?",
			text: "Aksi ini untuk memperbarui rating organisasi beserta eventnya secara massal",
			icon: "question",
		}).then((result) => {
			if (result.isConfirmed) {
				updateOrganizationRatingsMutation.mutate(); // Panggil fungsi updateOrganizationRatingsMutation tanpa ID
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
			name: "Nama Organisasi",
			selector: (row) => row.nama || "-",
			sortable: true,
			wrap: true,
			width: "300px",
		},
		{
			name: "Logo",
			selector: (row) => (
				<>
					<AsyncImage
						loading="lazy"
						transition={Fade}
						src={getImageUrl(`organizations/${row.logo}`)}
						alt={row.nama}
						className="w-20 h-20 object-cover rounded-lg m-1 border border-gray-200 flex-shrink-0"
						onError={(e) => {
							e.target.onerror = null;
							e.target.src = "https://placehold.co/400";
						}}
					/>
				</>
			),
			sortable: true,
			width: "170px",
		},
		{
			name: "Website",
			selector: (row) =>
				row.website ? (
					<a
						href={row.website.startsWith("http") ? row.website : `https://${row.website}`}
						target="_blank"
						rel="noopener noreferrer"
						className="text-blue-600 hover:underline">
						{row.website}
					</a>
				) : (
					"-"
				),
			sortable: true,
			width: "200px",
		},
		{
			name: "Status Verifikasi",
			selector: (row) => (
				<>
					{row.status_verifikasi === "verified" ? (
						<Badge variant={"success"}>Verified</Badge>
					) : row.status_verifikasi === "pending" ? (
						<Badge variant={"warning"}>Pending</Badge>
					) : (
						<Badge variant={"danger"}>Rejected</Badge>
					)}
				</>
			),
			sortable: true,
			width: "140px",
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
								<Link to={`/admin/organizations/edit/${row.id}`}>
									<MenuItem icon={<EditIcon className="text-yellow-500 hover:text-yellow-600" />}>
										Edit
									</MenuItem>
								</Link>
								<MenuItem
									onClick={() => handleDelete(row.id)}
									disabled={deleteOrganizationMutation.isLoading}
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

	if (organizationsError) {
		return (
			<div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
				<div className="flex flex-col items-center justify-center  text-gray-600">
					<AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
					<h3 className="text-lg font-semibold mb-2">Error</h3>
					<p className="text-gray-500 mb-4 text-center">Gagal mengambil data organisasi.</p>
					<p className="text-red-500 mb-4 text-center font-semibold">
						{organizationsError.message}
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="py-8 page-transition min-h-screen">
			<div className="max-w-6xl mx-auto px-4">
				<div className="bg-white rounded-lg shadow p-6">
					<div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-3">
						<h2 className="text-base md:text-lg font-semibold">
							{" "}
							{organizationsRefetching ? (
								<FetchLoader variant="inline" text="Mengambil Data Terbaru..." />
							) : (
								"Daftar Organisasi"
							)}
						</h2>
						<div className="flex gap-2 md:gap-4 w-full md:w-auto sm:flex-row flex-col">
							<Button
								type="button"
								variant="warning"
								onClick={handleUpdateRatings}
								disabled={isLoading}
								loading={isLoading}
								className="w-full md:w-auto">
								{isLoading ? null : <Star className="w-4 h-4 mr-2" />}
								Perbarui Rating
							</Button>
							<LinkButton
								to="/admin/organizations/create"
								variant="success"
								size="sm"
								className="w-full md:w-auto">
								<Plus className="w-4 h-4 mr-2" /> Tambah Organisasi
							</LinkButton>
						</div>
					</div>

					{/* Filter & Search - Always Visible */}
					<div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
						<input
							type="text"
							placeholder="Cari organisasi, perwakilan, atau deskripsi..."
							value={searchOrganization}
							onChange={(e) => setSearchOrganization(e.target.value)}
							className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-emerald-500"
						/>
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
					</div>

					{organizationsLoading ? (
						<div className="flex h-96 justify-center py-20">
							{" "}
							<Loader2 className="animate-spin h-7 w-7 text-emerald-600" />
						</div>
					) : (
						<DataTable
							columns={columns}
							data={organizations}
							selectableRows={true}
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
							progressPending={organizationsRefetching}
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
								<div className="p-6 bg-white rounded-md border border-gray-100 shadow-sm">
									<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
										{/* Left column */}
										<div className="space-y-3">
											<div className="text-sm text-gray-700">
												<span className="font-semibold ">Telepon Organisasi:</span>
												<span className="ml-2 text-gray-900 ">{data.telepon || "-"}</span>
											</div>
											<div className="text-sm text-gray-700">
												<span className="font-semibold">Email Organisasi:</span>
												<span className="ml-2 text-gray-900">{data.email || "-"}</span>
											</div>
											<div className="text-sm text-gray-700">
												<span className="font-semibold">Rating:</span>
												<RatingStars
													rating={data.rating}
													maxRating={5}
													size="sm"
													interactive={false}
												/>{" "}
											</div>
										</div>
										<div className="space-y-3">
											<div className="text-sm text-gray-700">
												<span className="font-semibold">Nama Pengelola:</span>
												<span className="ml-2 text-gray-900 bg-emerald-100">
													{data.user?.nama || "-"}
												</span>
											</div>

											<div className="text-sm text-gray-700">
												<span className="font-semibold">Email Pengelola:</span>
												<span className="ml-2 text-gray-900 bg-emerald-100">
													{data.user?.email || "-"}
												</span>
											</div>
											<div className="text-sm text-gray-700">
												<span className="font-semibold">Status Akun Pengelola:</span>
												<span className="ml-2 text-gray-900">
													{data.user?.status === "active" ? (
														<Badge variant={"success"}>Aktif</Badge>
													) : data.user?.status === "inactive" ? (
														<Badge variant={"warning"}>Inactive</Badge>
													) : (
														<Badge variant={"danger"}>Suspended</Badge>
													)}
												</span>
											</div>
										</div>

										{/* Right column */}
										<div className="space-y-3">
											<div>
												<div className="text-sm font-semibold text-gray-700 mb-1">Alamat:</div>
												<div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
													{data.alamat || "-"}
												</div>
											</div>
											<div>
												<div className="text-sm font-semibold text-gray-700 mb-1">
													Deskripsi Organisasi:
												</div>
												<div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
													{data.deskripsi || "-"}
												</div>
											</div>
										</div>
									</div>
								</div>
							)}
							noDataComponent={
								<div className="flex flex-col items-center justify-center h-64 text-gray-600">
									<AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
									<h3 className="text-lg font-semibold mb-2">
										{searchOrganization
											? "No Matching Organizations Found"
											: "No Organizations Available"}
									</h3>
									<p className="text-gray-500 mb-4 text-center">
										{searchOrganization
											? "Tidak ada organisasi yang sesuai dengan pencarian."
											: "Belum ada data organisasi."}
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
