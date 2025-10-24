import { useAdminParticipants } from "@/_hooks/useParticipants";
import Button from "@/components/ui/Button";
import { ChevronDown, Loader2, PencilIcon, Plus, Trash } from "lucide-react";
import { useMemo, useState } from "react";
import DataTable from "react-data-table-component";

export default function AdminEventParticipant() {
	const {
		data: participants,
		isLoading: participantsLoading,
		error: participantsError,
	} = useAdminParticipants();

	// Local state for search/filter
	const [searchParticipant, setSearchParticipant] = useState("");

	const filteredParticipants = useMemo(() => {
		if (!searchParticipant) return participants;
		const query = searchParticipant.toLowerCase();
		return participants.filter((participantItem => {
			const peserta = String(participantItem.user?.nama || "").toLowerCase();
			const event = String(participantItem.event?.judul || "").toLowerCase();
			const status = String(participantItem.status || "").toLowerCase();
			return (
				peserta.includes(query) ||
				event.includes(query) ||
				status.includes(query)
			);
		}))
	}, [participants, searchParticipant]);

	const columns = [
		{
			name: "No",
			cell: (row, index) => index + 1,
			sortable: false,
			width: "60px",
		},
		{
			name: "Peserta",
			selector: (row) => row.user?.nama || "-",
			sortable: true,
			wrap: true,
			width: "150px",
		},
		{
			name: "Event yang diikuti",
			selector: (row) => row.event?.judul || "-",
			sortable: false,
			wrap: true,
		},
		{
			name: "Tanggal Daftar",
			selector: (row) =>
				row.tanggal_daftar
					? new Date(row.tanggal_daftar.replace(" ", "T")).toLocaleDateString(
							"id-ID",
							{
								day: "numeric",
								month: "long",
								year: "numeric",
							}
					  )
					: "-",
			sortable: true,
			width: "170px",
		},
		{
			name: "Status",
			selector: (row) => row.status || "-",
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
					<button className="text-sm text-red-500 hover:underline">
						{" "}
						<Trash className="w-4 h-4 mr-2 hover:text-red-600" />
					</button>
				</div>
			),
			width: "140px",
		},
	];

	return (
		<div className="py-8">
			<div className="max-w-6xl mx-auto px-4">
				<div className="mb-6">
					<h1 className="text-2xl font-bold text-gray-900">Admin Participant List</h1>
					<p className="text-gray-600">Kelola data partisipan di sini</p>
				</div>

				<div className="bg-white rounded-lg shadow p-6">
					<div className="flex justify-between items-center mb-4">
						<h2 className="text-lg font-semibold">Daftar Participant</h2>
						<Button variant="success" size="sm">
							<Plus className="w-4 h-4 mr-2" /> Tambah Event Participant
						</Button>
					</div>

					{participantsLoading ? (
						<div className="flex h-96 justify-center py-20">
							{" "}
							<Loader2 className="animate-spin h-7 w-7 text-emerald-600" />
						</div>
					) : participantsError ? (
						<div className="text-red-600">
							Error loading participants: {participantsError.message}
						</div>
					) : participants.length === 0 ? (
						<div className="flex flex-col items-center justify-center h-48 text-gray-600">
							<h3 className="text-lg font-semibold mb-2">
								No Participant Available
							</h3>
							<p className="text-gray-500">Belum ada data event participant.</p>
						</div>
					) : (
						<>
							<div className="w-80 mb-4">
								<input
									type="text"
									placeholder="Cari peserta..."
									value={searchParticipant}
									onChange={(e) => setSearchParticipant(e.target.value)}
									className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-emerald-500"
								/>
							</div>
							<DataTable
								columns={columns}
								data={filteredParticipants}
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
											<strong>Nama peserta:</strong> {data.user?.nama || "-"}
										</p>
										<p className="text-sm text-gray-600">
											<strong>Event yang diikuti:</strong> {data.event?.judul || "-"}
										</p>
										<p className="text-sm text-gray-600">
											<strong>Tanggal daftar:</strong> {
												data.tanggal_daftar
												? new Date(data.tanggal_daftar.replace(" ", "T")).toLocaleDateString(
														"id-ID",
														{
															day: "numeric",
															month: "long",
															year: "numeric",
														}
												)
												: "-"
											}
										</p>
										<p className="text-sm text-gray-600">
											<strong>Tanggal Konfirmasi:</strong> {
												data.tanggal_konfirmasi
												? new Date(data.tanggal_konfirmasi.replace(" ", "T")).toLocaleDateString(
														"id-ID",
														{
															day: "numeric",
															month: "long",
															year: "numeric",
														}
												)
												: "Belum dikonfirmasi"
											}
										</p>
										<p className="text-sm text-gray-600 mt-2">
											<strong>Catatan:</strong>
										</p>
										<p className="text-sm text-gray-800 mt-1">
											{data.catatan || "-"}
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
