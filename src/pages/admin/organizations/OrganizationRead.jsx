import { useMemo, useState } from "react";
import DataTable from "react-data-table-component";
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
import {
	Menu,
	MenuButton,
	MenuList,
	MenuItem,
	Portal,
	IconButton,
} from "@chakra-ui/react";
import { LinkButton } from "@/components/ui/Button";
import Swal from "sweetalert2";
import { showToast } from "@/components/ui/Toast";
import {
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

export default function AdminOrganization() {
	const {
		data: organizations = [],
		isLoading: organizationsLoading,
		error: organizationsError,
		isFetching: organizationsRefetching,
	} = useAdminOrganizations();

	const deleteOrganizationMutation = useAdminDeleteOrganizationMutation();

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
						href={`https://${row.website}`}
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
						<Badge variant={"success"}>Disetujui</Badge>
					) : row.status_verifikasi === "pending" ? (
						<Badge variant={"warning"}>Pending</Badge>
					) : (
						<Badge variant={"danger"}>Ditolak</Badge>
					)}
				</>
			),
			sortable: true,
			width: "140px",
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
							<Link to={`/admin/organizations/edit/${row.id}`}>
								<MenuItem
									icon={
										<EditIcon className="text-yellow-500 hover:text-yellow-600" />
									}>
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
			),
			width: "140px",
		},
	];

	if (organizationsError) {
		return (
			<div className="flex flex-col items-center justify-center min-h-[520px] text-gray-600">
				<AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
				<h3 className="text-lg font-semibold mb-2">Error</h3>
				<p className="text-gray-500 mb-4 text-center">
					Gagal mengambil data organisasi.
				</p>
				<p className="text-red-500 mb-4 text-center font-semibold">
					{organizationsError.message}
				</p>
			</div>
		);
	}

	return (
		<div className="py-8 page-transition min-h-screen">
			<div className="max-w-6xl mx-auto px-4">
				<div className="bg-white rounded-lg shadow p-6">
					<div className="flex justify-between items-center mb-4">
						<h2 className="text-lg font-semibold">
							{" "}
							{organizationsRefetching ? (
								<FetchLoader
									variant="inline"
									text="Mengambil Data Terbaru..."
								/>
							) : (
								"Daftar Organisasi"
							)}
						</h2>
						<LinkButton
							to="/admin/organizations/create"
							variant="success"
							size="sm">
							<Plus className="w-4 h-4 mr-2" /> Tambah Organisasi
						</LinkButton>
					</div>

					{organizationsLoading ? (
						<div className="flex h-96 justify-center py-20">
							{" "}
							<Loader2 className="animate-spin h-7 w-7 text-emerald-600" />
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
									<div className="p-6 bg-white rounded-md border border-gray-100 shadow-sm">
										<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
											{/* Left column */}
											<div className="space-y-3">
												<div className="text-sm text-gray-700">
													<span className="font-semibold">
														Nama Penanggung Jawab:
													</span>
													<span className="ml-2 text-gray-900">
														{data.user?.nama || "-"}
													</span>
												</div>
												<div className="text-sm text-gray-700">
													<span className="font-semibold">No Telp:</span>
													<span className="ml-2 text-gray-900">
														{data.telepon || "-"}
													</span>
												</div>
												<div className="text-sm text-gray-700">
													<span className="font-semibold">Email:</span>
													<span className="ml-2 text-gray-900">
														{data.email || "-"}
													</span>
												</div>
											</div>

											{/* Right column */}
											<div className="space-y-3">
												<div>
													<div className="text-sm font-semibold text-gray-700 mb-1">
														Alamat:
													</div>
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
						</>
					)}
				</div>
			</div>
		</div>
	);
}
