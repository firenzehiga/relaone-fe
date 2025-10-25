import {
	useAdminDeleteLocationMutation,
	useAdminLocations,
} from "@/_hooks/useLocations";
import Button from "@/components/ui/Button";
import Swal from "sweetalert2";
import { toast } from "react-hot-toast";
import { ChevronDown, Loader2, PencilIcon, Plus, Trash } from "lucide-react";
import { useMemo, useState } from "react";
import DataTable from "react-data-table-component";

export default function AdminLocation() {
	const {
		data: locations,
		isLoading: locationsLoading,
		error: locationsError,
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
						const msg =
							err?.response?.data?.message || "Gagal menghapus location.";
						toast.error(msg, { position: "top-center" });
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
			selector: (row) => row.tipe || "-",
			sortable: true,
			width: "150px",
		},
		{
			name: "Aksi",
			cell: (row) => (
				<div className="flex items-center space-x-2">
					<button className="text-sm text-yellow-600 hover:underline">
						{" "}
						<PencilIcon className="w-4 h-4 mr-2 hover:text-orange-00" />
					</button>
					<button
						onClick={() => handleDelete(row.id)}
						className="text-sm text-red-500 hover:underline"
						disabled={deleteLocationMutation.isConfirmed}>
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
					<h1 className="text-2xl font-bold text-gray-900">Data Lokasi</h1>
					<p className="text-gray-600">Kelola data lokasi di sini</p>
				</div>

				<div className="bg-white rounded-lg shadow p-6">
					<div className="flex justify-between items-center mb-4">
						<h2 className="text-lg font-semibold">Daftar Lokasi</h2>
						<Button variant="success" size="sm">
							<Plus className="w-4 h-4 mr-2" /> Tambah Lokasi
						</Button>
					</div>

					{locationsLoading ? (
						<div className="flex h-96 justify-center py-20">
							{" "}
							<Loader2 className="animate-spin h-7 w-7 text-emerald-600" />
						</div>
					) : locationsError ? (
						<div className="text-red-600">
							Error loading locations: {locationsError.message}
						</div>
					) : locations.length === 0 ? (
						<div className="flex flex-col items-center justify-center h-48 text-gray-600">
							<h3 className="text-lg font-semibold mb-2">
								No location Available
							</h3>
							<p className="text-gray-500">Belum ada data lokasi.</p>
						</div>
					) : (
						<>
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
							/>
						</>
					)}
				</div>
			</div>
		</div>
	);
}
