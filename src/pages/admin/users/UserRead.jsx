import { useMemo, useState } from "react";
import DataTable from "react-data-table-component";
import {
	ChevronDown,
	Plus,
	Loader2,
	Trash,
	PencilIcon,
	AlertCircle,
} from "lucide-react";
import Badge from "@/components/ui/Badge";
import { useAdminDeleteUserMutation, useAdminUsers } from "@/_hooks/useUsers";
import FetchLoader from "@/components/ui/FetchLoader";
import { formatDate, getImageUrl } from "@/utils";
import Swal from "sweetalert2";
import { useAuthStore } from "@/_hooks/useAuth";

export default function AdminUser() {
	const {
		data: users = [],
		isLoading: usersLoading,
		error: usersError,
		isFetching: usersRefetching,
	} = useAdminUsers();

	const deleteUserMutation = useAdminDeleteUserMutation();

	const { isLoading } = useAuthStore();

	// Local state for search/filter
	const [searchUser, setSearchUser] = useState("");

	const filteredUsers = useMemo(() => {
		if (!searchUser) return users;
		const query = searchUser.toLowerCase();
		return users.filter((userItem) => {
			const nama = String(userItem.nama || "").toLowerCase();
			const email = String(userItem.email || "").toLowerCase();
			const jenisKelamin = String(userItem.jenis_kelamin || "").toLowerCase();
			return (
				nama.includes(query) ||
				email.includes(query) ||
				jenisKelamin.includes(query)
			);
		});
	}, [users, searchUser]);

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
					"px-4 py-2 focus:outline-none rounded-md bg-emerald-600 hover:bg-emerald-700 text-white",
				cancelButton:
					"px-4 py-2 rounded-md border border-gray-300 bg-gray-200 hover:bg-gray-300 text-gray-700",
			},
			backdrop: true,
			preConfirm: (value) => {
				if (value !== confirmText) {
					Swal.showValidationMessage(
						`Anda harus mengetik "${confirmText}" untuk melanjutkan.`
					);
				}
				return value;
			},
		}).then((result) => {
			if (result.isConfirmed && result.value === confirmText) {
				deleteUserMutation.mutate(id);
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
					) : (
						<Badge variant={"danger"}>Inactive</Badge>
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
					<div className="flex items-center space-x-2">
						<button
							onClick={() => handleDelete(row.id)}
							className="text-sm text-red-500 hover:underline">
							<Trash className="w-4 h-4 mr-2 hover:text-red-600" />
						</button>
					</div>
				);
			},
			width: "140px",
		},
	];

	if (usersError) {
		return (
			<div className="flex flex-col items-center justify-center min-h-[520px] text-gray-600">
				<AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
				<h3 className="text-lg font-semibold mb-2">Error</h3>
				<p className="text-gray-500 mb-4 text-center">
					Gagal mengambil data pengguna.
				</p>
				<p className="text-red-500 mb-4 text-center font-semibold">
					{usersError.message}
				</p>
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
								<FetchLoader
									variant="inline"
									text="Mengambil Data Terbaru..."
								/>
							) : (
								"Daftar User"
							)}
						</h2>
					</div>

					{usersLoading ? (
						<div className="flex h-72 md:h-96 justify-center py-20">
							<Loader2 className="animate-spin h-6 w-6 md:h-7 md:w-7 text-emerald-600" />
						</div>
					) : (
						<>
							<div className="w-full md:w-80 mb-4">
								<input
									type="text"
									placeholder="Cari nama, email, atau jenis kelamin..."
									value={searchUser}
									onChange={(e) => setSearchUser(e.target.value)}
									className="border border-gray-300 rounded-md px-3 py-2 text-sm md:text-sm w-full focus:outline-none focus:ring-2 focus:ring-emerald-500"
								/>
							</div>
							<DataTable
								columns={columns}
								data={Array.isArray(filteredUsers) ? filteredUsers : []}
								pagination
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
													<div className="text-sm text-gray-700 font-semibold">
														Jenis Kelamin:
													</div>
													<div className="text-sm ml-2">
														{data.jenis_kelamin === "laki-laki" ? (
															<p className="text-sm text-gray-800 mt-1">
																Laki-laki
															</p>
														) : data.jenis_kelamin === "perempuan" ? (
															<p className="text-sm text-gray-800 mt-1">
																Perempuan
															</p>
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
													<span className="ml-2 text-gray-900">
														{data.telepon || "-"}
													</span>
												</div>
												<div className="text-sm text-gray-700">
													<span className="font-semibold">Alamat:</span>
													<span className="ml-2 text-gray-900">
														{data?.alamat || "-"}
													</span>
												</div>
											</div>
										</div>
									</div>
								)}
								noDataComponent={
									<div className="flex flex-col items-center justify-center h-64 text-gray-600">
										<AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
										<h3 className="text-lg font-semibold mb-2">
											{searchUser
												? "No Matching Users Found"
												: "No Users Available"}
										</h3>
										<p className="text-gray-500 mb-4 text-center">
											{searchUser
												? "Tidak ada pengguna yang sesuai dengan pencarian."
												: "Belum ada data pengguna."}
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
