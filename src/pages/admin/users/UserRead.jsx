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
import DynamicButton from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { useAdminUsers } from "@/_hooks/useUsers";
import FetchLoader from "@/components/ui/FetchLoader";

export default function AdminUser() {
	const {
		data: users = [],
		isLoading: usersLoading,
		error: usersError,
		isFetching: usersRefetching,
	} = useAdminUsers();

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
							src={row.foto_profil}
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
						<Badge variant={"warning"}>Admin</Badge>
					) : row.role === "organization" ? (
						<Badge variant={"primary"}>Organization</Badge>
					) : (
						<Badge variant={"secondary"}>Volunteer</Badge>
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
			cell: (row) => (
				<div className="flex items-center space-x-2">
					<button className="text-sm text-yellow-600 hover:underline">
						<PencilIcon className="w-4 h-4 mr-2 hover:text-orange-00" />
					</button>
					<button className="text-sm text-red-500 hover:underline">
						<Trash className="w-4 h-4 mr-2 hover:text-red-600" />
					</button>
				</div>
			),
			width: "140px",
		},
	];

	if (usersError) {
		return (
			<div className="flex flex-col items-center justify-center h-[40vh] text-gray-600">
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
							Daftar Pengguna
						</h2>
						<DynamicButton
							variant="success"
							size="sm"
							className="px-2 py-1 text-xs md:px-3 md:py-2 md:text-sm">
							<Plus className="w-3 h-3 md:w-4 md:h-4 mr-2" /> Tambah Pengguna
						</DynamicButton>
					</div>

					{usersLoading ? (
						<div className="flex h-72 md:h-96 justify-center py-20">
							<Loader2 className="animate-spin h-6 w-6 md:h-7 md:w-7 text-emerald-600" />
						</div>
					) : (
						<>
							{usersRefetching && <FetchLoader />}

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
									<div className="p-3 md:p-4 bg-gray-50 rounded-md text-sm md:text-base">
										<p className="text-sm text-gray-600">
											<strong>Alamat:</strong> {data?.alamat || "-"}
										</p>
										<p className="text-sm text-gray-600 mt-2">
											<strong>No Telepon:</strong>
										</p>
										<p className="text-sm text-gray-800 mt-1">
											{data.telepon || "-"}
										</p>
										<p className="text-sm text-gray-600 mt-2">
											<strong>Tanggal Lahir:</strong>
										</p>
										<p className="text-sm text-gray-800 mt-1">
											{data.tanggal_lahir
												? new Date(
														data.tanggal_lahir.replace(" ", "T")
												  ).toLocaleDateString("id-ID", {
														day: "numeric",
														month: "long",
														year: "numeric",
												  })
												: "-"}
										</p>
										<p className="text-sm text-gray-600 mt-2">
											<strong>Jenis Kelamin:</strong>
										</p>
										{data.jenis_kelamin === "laki-laki" ? (
											<p className="text-sm text-gray-800 mt-1">Laki-laki</p>
										) : data.jenis_kelamin === "perempuan" ? (
											<p className="text-sm text-gray-800 mt-1">Perempuan</p>
										) : (
											<p className="text-sm text-gray-800 mt-1">-</p>
										)}
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
