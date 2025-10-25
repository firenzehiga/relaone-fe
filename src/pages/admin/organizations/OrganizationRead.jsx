import { useMemo, useState } from "react";
import DataTable from "react-data-table-component";
import { ChevronDown, Plus, Loader2, Trash, PencilIcon } from "lucide-react";
import Button from "@/components/ui/Button";
import { useAdminOrganizations } from "@/_hooks/useOrganizations";
import Badge from "@/components/ui/Badge";

export default function AdminOrganization() {
	const {
		data: organizations,
		isLoading: organizationsLoading,
		error: organizationsError,
	} = useAdminOrganizations();

	// Local state for search/filter
	const [searchOrganization, setSearchOrganization] = useState("");

	const filteredOrganizations = useMemo(() => {
		if (!searchOrganization) return organizations;
		const query = searchOrganization.toLowerCase();
		return organizations.filter((organizationItem) => {
			const namaOrg = String(organizationItem.nama || "").toLowerCase();
			const namaUser = String(organizationItem?.user?.nama || "").toLowerCase();
			const deskripsi = String(organizationItem.deskripsi || "").toLowerCase();
			return (
				namaOrg.includes(query) ||
				namaUser.includes(query) ||
				deskripsi.includes(query)
			);
		});
	}, [organizations, searchOrganization]);

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
				<div className="flex items-center mt-1 mb-1">
					{row.logo ? (
						<img
							src={row.logo}
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
			width: "170px",
		},
		{
			name: "Website",
			selector: (row) =>
				row.website ? (
					<a
						href={row.website}
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
				<Badge variant={"primary"}>{row.status_verifikasi || "-"}</Badge>
			),
			sortable: true,
			width: "140px",
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

	return (
		<div className="py-8 page-transition">
			<div className="max-w-6xl mx-auto px-4">
				<div className="mb-6">
					<h1 className="text-2xl font-bold text-gray-900">Data Organisasi</h1>
					<p className="text-gray-600">Kelola data organisasi di sini</p>
				</div>

				<div className="bg-white rounded-lg shadow p-6">
					<div className="flex justify-between items-center mb-4">
						<h2 className="text-lg font-semibold">Daftar Organisasi</h2>
						<Button variant="success" size="sm">
							<Plus className="w-4 h-4 mr-2" /> Tambah Organisasi
						</Button>
					</div>

					{organizationsLoading ? (
						<div className="flex h-96 justify-center py-20">
							{" "}
							<Loader2 className="animate-spin h-7 w-7 text-emerald-600" />
						</div>
					) : organizationsError ? (
						<div className="text-red-600">
							Error loading organizations: {organizationsError.message}
						</div>
					) : organizations.length === 0 ? (
						<div className="flex flex-col items-center justify-center h-48 text-gray-600">
							<h3 className="text-lg font-semibold mb-2">
								No Organizations Available
							</h3>
							<p className="text-gray-500">Belum ada data organisasi.</p>
						</div>
					) : (
						<>
							<div className="w-80 mb-4">
								<input
									type="text"
									placeholder="Cari organisasi, perwakilan, atau deskripsi..."
									value={searchOrganization}
									onChange={(e) => setSearchOrganization(e.target.value)}
									className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-emerald-500"
								/>
							</div>
							<DataTable
								columns={columns}
								data={filteredOrganizations}
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
									<div className="p-4 bg-gray-50 rounded-md">
										<p className="text-sm text-gray-600">
											<strong>Nama Perwakilan:</strong>{" "}
											{data?.user?.nama || "-"}
										</p>
										<p className="text-sm text-gray-600 mt-2">
											<strong>Deskripsi:</strong>
										</p>
										<p className="text-sm text-gray-800 mt-1">
											{data.deskripsi || "-"}
										</p>
										<p className="text-sm text-gray-600 mt-2">
											<strong>No Telepon:</strong>
										</p>
										<p className="text-sm text-gray-800 mt-1">
											{data.telepon || "-"}
										</p>
										<p className="text-sm text-gray-600 mt-2">
											<strong>Email:</strong>
										</p>
										<p className="text-sm text-gray-800 mt-1">
											{data.email || "-"}
										</p>
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
