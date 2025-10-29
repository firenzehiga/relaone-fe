import {
	useAdminDeleteLocationMutation,
	useAdminLocations,
} from "@/_hooks/useLocations";
import { LinkButton } from "@/components/ui/Button";
import Swal from "sweetalert2";
import { showToast } from "@/components/ui/Toast";
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
import { useMemo, useState } from "react";
import DataTable from "react-data-table-component";
import { parseApiError } from "@/utils";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import FetchLoader from "@/components/ui/FetchLoader";
import Badge from "@/components/ui/Badge";

export default function AdminLocation() {
	const {
		data: locations,
		isLoading: locationsLoading,
		error: locationsError,
		isFetching: locationsRefetching,
	} = useAdminLocations();

	const deleteLocationMutation = useAdminDeleteLocationMutation();

	// Local state for search/filter
	const [searchLocation, setSearchLocation] = useState("");

	const filteredLocations = useMemo(() => {
		if (!searchLocation) return locations;
		const query = searchLocation.toLowerCase();
		return locations.filter((locationItem) => {
			const lokasi = String(locationItem.nama || "").toLowerCase();
			const kota = String(locationItem.kota || "").toLowerCase();
			const provinsi = String(locationItem.provinsi || "").toLowerCase();
			return (
				lokasi.includes(query) ||
				kota.includes(query) ||
				provinsi.includes(query)
			);
		});
	}, [locations, searchLocation]);

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
							<Link to={`/admin/locations/edit/${row.id}`}>
								<MenuItem
									icon={
										<EditIcon className="text-yellow-500 hover:text-yellow-600" />
									}>
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
			<div className="flex flex-col items-center justify-center h-[40vh] text-gray-600">
				<AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
				<h3 className="text-lg font-semibold mb-2">Error</h3>
				<p className="text-gray-500 mb-4 text-center">
					Gagal mengambil data lokasi.
				</p>
				<p className="text-red-500 mb-4 text-center font-semibold">
					{locationsError.message}
				</p>
			</div>
		);
	}

	return (
		<div className="py-8 page-transition">
			<div className="max-w-6xl mx-auto px-4">
				<div className="bg-white rounded-lg shadow p-6">
					<div className="flex justify-between items-center mb-4">
						<h2 className="text-lg font-semibold">Daftar Lokasi</h2>
						<LinkButton
							to="/admin/locations/create"
							variant="success"
							size="sm">
							<Plus className="w-4 h-4 mr-2" /> Tambah Lokasi
						</LinkButton>
					</div>

					{locationsLoading ? (
						<div className="flex h-96 justify-center py-20">
							{" "}
							<Loader2 className="animate-spin h-7 w-7 text-emerald-600" />
						</div>
					) : (
						<>
							{locationsRefetching && <FetchLoader />}

							<div className="w-80 mb-4">
								<input
									type="text"
									placeholder="Cari lokasi, kota, atau provinsi..."
									value={searchLocation}
									onChange={(e) => setSearchLocation(e.target.value)}
									className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-emerald-500"
								/>
							</div>
							<DataTable
								columns={columns}
								data={filteredLocations}
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
										<p className="text-sm text-gray-600 mt-2">
											<strong>Koordinat Peta:</strong>
										</p>
										<p className="text-sm text-gray-800 mt-1">
											<strong>Lat:</strong> {data.latitude || 0} <br />
											<strong>Long:</strong> {data.longitude || 0}
										</p>
										{data.alamat_lengkap && (
											<p className="text-sm text-gray-600 mt-2">
												<strong>Alamat Lengkap:</strong> {data.alamat_lengkap}
											</p>
										)}
									</div>
								)}
								noDataComponent={
									<div className="flex flex-col items-center justify-center h-64 text-gray-600">
										<AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
										<h3 className="text-lg font-semibold mb-2">
											{searchLocation
												? "No Matching Locations Found"
												: "No Locations Available"}
										</h3>
										<p className="text-gray-500 mb-4 text-center">
											{searchLocation
												? "Tidak ada lokasi yang sesuai dengan pencarian."
												: "Belum ada data lokasi"}
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
