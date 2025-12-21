import { useMemo, useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import {
	ChevronDown,
	Loader2,
	Trash,
	AlertCircle,
	EditIcon,
	EllipsisVerticalIcon,
} from "lucide-react";
import Badge from "@/components/ui/Badge";
import {
	useAdminDeleteUserMutation,
	useAdminUsers,
	useAdminChangeStatusUserMutation,
} from "@/_hooks/useUsers";
import { useDebounce } from "@/_hooks/utils/useDebounce";
import FetchLoader from "@/components/ui/FetchLoader";
import { getImageUrl } from "@/utils";
import { formatDate } from "@/utils/dateFormatter";
import Swal from "sweetalert2";
import { useAuthStore } from "@/_hooks/useAuth";
import { Menu, MenuButton, MenuList, MenuItem, Portal, IconButton } from "@chakra-ui/react";

export default function AdminUser() {
	const [searchUser, setSearchUser] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const [rowsPerPage, setRowsPerPage] = useState(10);

	// Debounce search menggunakan custom hook
	const debouncedSearch = useDebounce(searchUser, 500);

	// Reset ke halaman 1 saat search berubah
	useEffect(() => {
		setCurrentPage(1);
	}, [debouncedSearch]);

	const {
		users,
		pagination,
		isLoading: usersLoading,
		error: usersError,
		isFetching: usersRefetching,
	} = useAdminUsers(currentPage, rowsPerPage, debouncedSearch);

	const deleteUserMutation = useAdminDeleteUserMutation();

	const { isLoading } = useAuthStore();

	// Fungsi untuk menangani penghapusan user dengan konfirmasi ketik kata kunci
	const handleDelete = (id) => {
		if (!id) return;
		const confirmText = "HAPUS PERMANEN";
		Swal.fire({
			title: "Hapus User?",
			html:
				`<span style="color: #dc2626; font-weight:600">⚠️ Aksi ini tidak bisa dibatalkan!</span>` +
				`<br/><br/>Aksi ini akan menghapus user beserta data terkait seperti, organisasi, event, partisipasi, dan lain sebagainya secara permanen dari sistem.`,
			icon: "warning",
			input: "text",
			inputPlaceholder: `Ketik "${confirmText}" untuk konfirmasi`,
			showCancelButton: true,
			confirmButtonText: "Ya, Hapus!",
			cancelButtonText: "Batal",
			customClass: {
				// kurangi ukuran popup (max-w-md vs max-w-lg) supaya card tidak terlalu besar
				popup: "bg-white rounded-xl shadow-xl p-5 max-w-md w-full",
				title: "text-lg font-semibold text-gray-900",
				content: "text-sm text-gray-600 dark:text-gray-300 mt-1",
				// tambahkan container actions dengan gap agar tombol tidak saling dempet
				actions: "flex gap-3 justify-center mt-4",
				confirmButton:
					"px-4 py-2 focus:outline-none rounded-md bg-red-600 hover:bg-red-700 text-white",
				cancelButton:
					"px-4 py-2 rounded-md border border-gray-300 bg-gray-200 hover:bg-gray-300 text-gray-700",
			},
			backdrop: true,
			preConfirm: (value) => {
				if (value !== confirmText) {
					Swal.showValidationMessage(`Anda harus mengetik "${confirmText}" untuk melanjutkan.`);
				}
				return value;
			},
		}).then((result) => {
			if (result.isConfirmed && result.value === confirmText) {
				deleteUserMutation.mutate(id);
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

	// Fungsi untuk ubah status user dengan konfirmasi mirip delete
	const changeStatusMutation = useAdminChangeStatusUserMutation();
	const handleChangeStatus = (id, currentStatus) => {
		if (!id) return;
		const confirmText = "UBAH STATUS";
		Swal.fire({
			title: "Ubah Status User?",
			html:
				`<div class="text-left space-y-3">` +
				`<p class="text-sm text-gray-600">Pilih status yang diinginkan untuk user ini.</p>` +
				`<div><select id="swal-status" class="border border-gray-300 rounded-md px-3 py-2 text-sm w-full bg-white">` +
				`<option value="active" ${currentStatus === "active" ? "selected" : ""}>Active</option>` +
				`<option value="inactive" ${
					currentStatus === "inactive" ? "selected" : ""
				}>Inactive</option>` +
				`<option value="suspended" ${
					currentStatus === "suspended" ? "selected" : ""
				}>Suspended</option>` +
				`</select></div>` +
				`<div class="text-xs text-gray-500">Ketik <strong>${confirmText}</strong> untuk konfirmasi perubahan status.</div>` +
				`<input id="swal-confirm" class="border border-gray-300 rounded-md px-3 py-2 text-sm w-full mt-2" placeholder="${confirmText}">` +
				`</div>`,
			icon: "question",
			showCancelButton: true,
			confirmButtonText: "Ubah",
			cancelButtonText: "Batal",
			customClass: {
				popup: "bg-white rounded-xl shadow-xl p-5 max-w-md w-full",
				title: "text-lg font-semibold text-gray-900",
				content: "text-sm text-gray-600 dark:text-gray-300 mt-1",
				actions: "flex gap-3 justify-center mt-4",
				confirmButton:
					"px-4 py-2 focus:outline-none rounded-md bg-yellow-600 hover:bg-yellow-700 text-white",
				cancelButton:
					"px-4 py-2 rounded-md border border-gray-300 bg-gray-200 hover:bg-gray-300 text-gray-700",
			},
			backdrop: true,
			preConfirm: () => {
				const statusEl = document.getElementById("swal-status");
				const confirmEl = document.getElementById("swal-confirm");
				const status = statusEl?.value;
				const typed = confirmEl?.value?.trim();
				if (!status) {
					Swal.showValidationMessage("Pilih status terlebih dahulu.");
				}
				if (typed !== confirmText) {
					Swal.showValidationMessage(`Anda harus mengetik \"${confirmText}\" untuk konfirmasi.`);
				}
				return { status };
			},
		}).then((result) => {
			if (result.isConfirmed && result.value?.status) {
				changeStatusMutation.mutate({ id, status: result.value.status });
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
			name: "Nama",
			selector: (row) => row.nama || "-",
			sortable: true,
			wrap: true,
			width: "220px",
		},
		{
			name: "Foto Profil",
			selector: (row) => (
				<div className="flex items-center space-x-2 mt-1 mb-1">
					{row.foto_profil ? (
						<img
							src={getImageUrl(`foto_profil/${row.foto_profil}`)}
							alt={row.nama || "logo"}
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
			width: "130px",
		},
		{
			name: "Email",
			selector: (row) => row.email || "-",
			sortable: true,
			width: "200px",
		},
		{
			name: "Role",
			selector: (row) => (
				<>
					{row.role === "admin" ? (
						<Badge variant={"orange"}>Admin</Badge>
					) : row.role === "organization" ? (
						<Badge variant={"success"}>Organization</Badge>
					) : (
						<Badge variant={"primary"}>Volunteer</Badge>
					)}
				</>
			),
			sortable: true,
			width: "140px",
		},
		{
			name: "Status",
			selector: (row) => (
				<>
					{row.status === "active" ? (
						<Badge variant={"success"}>Active</Badge>
					) : row.status === "inactive" ? (
						<Badge variant={"danger"}>Inactive</Badge>
					) : row.status === "suspend" ? (
						<Badge variant={"orange"}>Suspend</Badge>
					) : (
						<Badge variant={"secondary"}>{row.status}</Badge>
					)}
				</>
			),
			sortable: true,
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
								<MenuItem
									onClick={() => handleChangeStatus(row.id, row.status)}
									icon={<EditIcon className="text-amber-500 hover:text-amber-600" />}>
									Ubah Status
								</MenuItem>
								<MenuItem
									onClick={() => handleDelete(row.id)}
									disabled={deleteUserMutation.isLoading}
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

	if (usersError) {
		return (
			<div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
				<div className="flex flex-col items-center justify-center  text-gray-600">
					<AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
					<h3 className="text-lg font-semibold mb-2">Error</h3>
					<p className="text-gray-500 mb-4 text-center">Gagal mengambil data pengguna.</p>
					<p className="text-red-500 mb-4 text-center font-semibold">{usersError.message}</p>
				</div>
			</div>
		);
	}

	return (
		<div className="py-8 page-transition min-h-screen">
			<div className="max-w-6xl mx-auto px-4">
				<div className="bg-white rounded-lg shadow p-4 sm:p-6">
					<div className="flex justify-between items-center mb-4">
						<h2 className="text-base md:text-lg font-semibold">
							{usersRefetching ? (
								<FetchLoader variant="inline" text="Mengambil Data Terbaru..." />
							) : (
								"Daftar User"
							)}
						</h2>
					</div>
					<div className="w-full md:w-80 mb-4">
						<input
							type="text"
							placeholder="Cari nama, email, atau jenis kelamin..."
							value={searchUser}
							onChange={(e) => setSearchUser(e.target.value)}
							className="border border-gray-300 rounded-md px-3 py-2 text-sm md:text-sm w-full focus:outline-none focus:ring-2 focus:ring-emerald-500"
						/>
					</div>
					{usersLoading ? (
						<div className="flex h-72 md:h-96 justify-center py-20">
							<Loader2 className="animate-spin h-6 w-6 md:h-7 md:w-7 text-emerald-600" />
						</div>
					) : (
						<DataTable
							columns={columns}
							data={users}
							pagination
							paginationServer
							paginationTotalRows={pagination.total || 0}
							paginationDefaultPage={currentPage}
							onChangePage={handlePageChange}
							onChangeRowsPerPage={handlePerRowsChange}
							paginationPerPage={rowsPerPage}
							paginationRowsPerPageOptions={[10, 20, 30, 50, 100]}
							progressPending={usersRefetching}
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
											<div className="flex items-start">
												<div className="text-sm text-gray-700 font-semibold">Jenis Kelamin:</div>
												<div className="text-sm ml-2">
													{data.jenis_kelamin === "laki-laki" ? (
														<p className="text-sm text-gray-800 mt-1">Laki-laki</p>
													) : data.jenis_kelamin === "perempuan" ? (
														<p className="text-sm text-gray-800 mt-1">Perempuan</p>
													) : (
														<p className="text-sm text-gray-800 mt-1">-</p>
													)}
												</div>
											</div>
											<div className="text-sm text-gray-700">
												<span className="font-semibold">Tanggal Lahir:</span>
												<span className="ml-2 text-gray-900">
													{formatDate(data.tanggal_lahir) || "-"}
												</span>
											</div>
										</div>

										{/* Right column */}
										<div className="space-y-3">
											<div className="text-sm text-gray-700">
												<span className="font-semibold">No Telepon:</span>
												<span className="ml-2 text-gray-900">{data.telepon || "-"}</span>
											</div>
											<div className="text-sm text-gray-700">
												<span className="font-semibold">Alamat:</span>
												<span className="ml-2 text-gray-900">{data?.alamat || "-"}</span>
											</div>
										</div>
									</div>
								</div>
							)}
							noDataComponent={
								<div className="flex flex-col items-center justify-center h-64 text-gray-600">
									<AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
									<h3 className="text-lg font-semibold mb-2">
										{searchUser ? "No Matching Users Found" : "No Users Available"}
									</h3>
									<p className="text-gray-500 mb-4 text-center">
										{searchUser
											? "Tidak ada pengguna yang sesuai dengan pencarian."
											: "Belum ada data pengguna."}
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
