import { useEffect, useMemo, useState } from "react";
import DataTable from "react-data-table-component";
import {
	ChevronDown,
	Plus,
	Loader2,
	Trash,
	EllipsisVerticalIcon,
	EditIcon,
	AlertCircle,
} from "lucide-react";
import Button, { LinkButton } from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { Menu, MenuButton, MenuList, MenuItem, Portal, IconButton } from "@chakra-ui/react";
import {
	useAdminCategory,
	useAdminDeleteCategory,
	useAdminBulkDeleteCategory,
} from "@/_hooks/useCategories";
import { swalDelete } from "@/components/ui/Swal";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import FetchLoader from "@/components/ui/FetchLoader";
import { useDebounce } from "@/_hooks/utils/useDebounce";
import { parseApiError } from "@/utils";
import { showToast } from "@/components/ui/Toast";
import { useAuthStore } from "@/_hooks/useAuth";

export default function AdminCategory() {
	const [searchCategory, setSearchCategory] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const [rowsPerPage, setRowsPerPage] = useState(10);

	// Debounce search menggunakan custom hook
	const debouncedSearch = useDebounce(searchCategory, 500);

	// Reset ke halaman 1 saat search berubah
	useEffect(() => {
		setCurrentPage(1);
	}, [debouncedSearch]);

	const {
		categories,
		pagination,
		isLoading: categoriesLoading,
		error: categoriesError,
		isFetching: categoriesRefetching,
	} = useAdminCategory(currentPage, rowsPerPage, debouncedSearch);

	const deleteCategoryMutation = useAdminDeleteCategory();

	// bulk delete mutation + selected rows
	const bulkDeleteMutation = useAdminBulkDeleteCategory();
	const { isLoading } = useAuthStore();

	const [selectedRows, setSelectedRows] = useState([]);
	const [clearSelectedRows, setClearSelectedRows] = useState(false);

	// Fungsi untuk menangani penghapusan kursus
	const handleDelete = (id) => {
		swalDelete().then((result) => {
			if (result.isConfirmed) {
				deleteCategoryMutation.mutate(id, {
					onSuccess: () => {
						toast.success("Category berhasil dihapus.", {
							position: "top-center",
						});
					},
					onError: (err) => {
						// ambil pesan backend kalau ada, fallback ke err.message
						const msg = parseApiError(err) || "Gagal menghapus kategori.";
						showToast({
							type: "error",
							tipIcon: "💡",
							tipText: "Pastikan kategori tidak terkait dengan data lain.",
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
			width: "60px",
		},
		{
			name: "Icon",
			selector: (row) => (
				<>
					{row.icon ? (
						row.icon
					) : (
						<span className="italic text-gray-400 text-xs">Tidak ada icon</span>
					)}
				</>
			),

			sortable: true,
			width: "170px",
		},
		{
			name: "Kategori",
			selector: (row) => <Badge color={row.warna}>{row.nama}</Badge> || "-",
			sortable: true,
			wrap: true,
			width: "150px",
		},
		{
			name: "Deskripsi",
			selector: (row) => row.deskripsi || "-",
			sortable: true,
			wrap: true,
		},
		{
			name: "Status",
			selector: (row) => (
				<>
					{row.is_active === true ? (
						<Badge variant={"success"}>Aktif</Badge>
					) : (
						<Badge variant={"danger"}>Tidak Aktif</Badge>
					)}
				</>
			),
			sortable: true,
			width: "120px",
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
							<Link to={`/admin/categories/edit/${row.id}`}>
								<MenuItem icon={<EditIcon className="text-yellow-500 hover:text-yellow-600" />}>
									Edit
								</MenuItem>
							</Link>
							<MenuItem
								onClick={() => handleDelete(row.id)}
								disabled={deleteCategoryMutation.isLoading}
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

	if (categoriesError) {
		return (
			<div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
				<div className="flex flex-col items-center justify-center  text-gray-600">
					<AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
					<h3 className="text-lg font-semibold mb-2">Error</h3>
					<p className="text-gray-500 mb-4 text-center">Gagal mengambil data kategori.</p>
					<p className="text-red-500 mb-4 text-center font-semibold">{categoriesError.message}</p>
				</div>
			</div>
		);
	}

	return (
		<div className="py-8 page-transition min-h-screen">
			<div className="max-w-6xl mx-auto px-4">
				<div className="bg-white rounded-lg shadow p-4 sm:p-6">
					<div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-3">
						<h2 className="text-base md:text-lg font-semibold">
							{categoriesRefetching ? (
								<FetchLoader variant="inline" text="Mengambil Data Terbaru..." />
							) : (
								"Daftar Kategori"
							)}{" "}
						</h2>
						<div className="flex gap-2 w-full md:w-auto">
							<LinkButton
								to="/admin/categories/create"
								variant="success"
								size="sm"
								className="w-full md:w-auto">
								<Plus className="w-4 h-4 mr-2" /> Tambah Kategori
							</LinkButton>
						</div>
					</div>

					<div className="w-full mb-4 flex flex-col md:flex-row md:items-center gap-2">
						<div className="w-full md:w-80">
							<label htmlFor="searchCategory" className="sr-only">
								Cari kategori
							</label>
							<input
								id="searchCategory"
								type="text"
								placeholder="Cari jenis kategori, atau deskripsi..."
								value={searchCategory}
								onChange={(e) => setSearchCategory(e.target.value)}
								className="border border-gray-300 rounded-md px-3 py-2 text-sm md:text-sm w-full focus:outline-none focus:ring-2 focus:ring-emerald-500"
							/>
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
					</div>
					{categoriesLoading ? (
						<div className="flex h-72 md:h-96 justify-center py-20">
							<Loader2 className="animate-spin h-6 w-6 md:h-7 md:w-7 text-emerald-600" />
						</div>
					) : (
						<DataTable
							columns={columns}
							data={categories}
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
							progressPending={categoriesRefetching}
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
							noDataComponent={
								<div className="flex flex-col items-center justify-center h-64 text-gray-600">
									<AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
									<h3 className="text-lg font-semibold mb-2">
										{searchCategory ? "No Matching Categories Found" : "No Categories Available"}
									</h3>
									<p className="text-gray-500 mb-4 text-center">
										{searchCategory
											? "Tidak ada kategori yang sesuai dengan pencarian."
											: "Belum ada data kategori"}
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
