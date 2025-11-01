import { useOrgParticipants } from "@/_hooks/useParticipants";
import Swal from "sweetalert2";
import { toast } from "react-hot-toast";
import { LinkButton } from "@/components/ui/Button";
import {
	ChevronDown,
	Plus,
	Loader2,
	Trash,
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
import { Link } from "react-router-dom";
import FetchLoader from "@/components/ui/FetchLoader";
import { parseApiError } from "@/utils";
import Badge from "@/components/ui/Badge";

export default function OrganizationEventParticipant() {
	const {
		data: participants = [],
		isLoading: participantsLoading,
		error: participantsError,
		isFetching: participantsRefetching,
	} = useOrgParticipants();

	// const deleteParticipantMutation = useOrgDeleteParticipantMutation();

	// Local state for search/filter
	const [searchParticipant, setSearchParticipant] = useState("");

	const filteredParticipants = useMemo(() => {
		if (!searchParticipant) return participants;
		const query = searchParticipant.toLowerCase();
		return participants.filter((participantItem) => {
			const peserta = String(participantItem.user?.nama || "").toLowerCase();
			const event = String(participantItem.event?.judul || "").toLowerCase();
			const status = String(participantItem.status || "").toLowerCase();
			return (
				peserta.includes(query) ||
				event.includes(query) ||
				status.includes(query)
			);
		});
	}, [participants, searchParticipant]);

	// Fungsi untuk menangani penghapusan kursus
	// const handleDelete = (id) => {
	// 	Swal.fire({
	// 		title: "Apa Anda yakin?",
	// 		text: "Kamu tidak akan bisa mengembalikan ini!",
	// 		showCancelButton: true,
	// 		confirmButtonText: "Ya, hapus!",
	// 		cancelButtonText: "Batal",
	// 		customClass: {
	// 			popup: "bg-white rounded-xl shadow-xl p-5 max-w-md w-full",
	// 			title: "text-lg font-semibold text-gray-900",
	// 			content: "text-sm text-gray-600 dark:text-gray-300 mt-1",
	// 			actions: "flex gap-3 justify-center mt-4",
	// 			confirmButton:
	// 				"px-4 py-2 focus:outline-none rounded-md bg-emerald-500 hover:bg-emerald-600 text-white",
	// 			cancelButton:
	// 				"px-4 py-2 rounded-md border border-gray-300 bg-gray-200 hover:bg-gray-300 text-gray-700",
	// 		},
	// 		backdrop: true,
	// 	}).then((result) => {
	// 		if (result.isConfirmed) {
	// 			deleteParticipantMutation.mutate(id, {
	// 				onSuccess: () => {
	// 					toast.success("Participant berhasil dihapus.", {
	// 						position: "top-center",
	// 					});
	// 				},
	// 				onError: (err) => {
	// 					// ambil pesan backend kalau ada, fallback ke err.message
	// 					const msg = parseApiError(err) || "Gagal menghapus participant.";
	// 					toast.error(msg, { position: "top-center" });
	// 				},
	// 			}); // Panggil fungsi deleteMutation dengan ID event
	// 		}
	// 	});
	// };

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
			selector: (row) => (
				<>
					{row.status === "registered" ? (
						<Badge variant={"warning"}>Sudah Daftar</Badge>
					) : row.status === "confirmed" ? (
						<Badge variant={"primary"}>Dikonfirmasi</Badge>
					) : row.status === "attended" ? (
						<Badge variant={"success"}>Hadir</Badge>
					) : row.status === "absent" ? (
						<Badge variant={"danger"}>Tidak Hadir</Badge>
					) : (
						<Badge variant={"secondary"}>{row.status || "-"}</Badge>
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
							<Link
								to={`/organization/event-participants/edit/${row.id}`}
								className="w-full">
								<MenuItem
									icon={
										<EditIcon className="text-yellow-500 hover:text-yellow-600" />
									}>
									Edit
								</MenuItem>
							</Link>
							<MenuItem
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

	if (participantsError) {
		return (
			<div className="flex flex-col items-center justify-center min-h-[520px] text-gray-600">
				<AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
				<h3 className="text-lg font-semibold mb-2">Error</h3>
				<p className="text-gray-500 mb-4 text-center">
					Gagal mengambil data participant.
				</p>
				<p className="text-red-500 mb-4 text-center font-semibold">
					{participantsError.message}
				</p>
			</div>
		);
	}

	return (
		<div className="py-8 bg-emerald-100 page-transition min-h-screen">
			<div className="max-w-6xl mx-auto px-4">
				<div className="bg-white rounded-lg shadow p-6">
					<div className="flex justify-between items-center mb-4">
						<h2 className="text-lg font-semibold">Daftar Participant</h2>
						<LinkButton
							to="/admin/event-participants/create"
							variant="success"
							size="sm">
							<Plus className="w-4 h-4 mr-2" /> Tambah Event Participant
						</LinkButton>
					</div>

					{participantsLoading ? (
						<div className="flex h-96 justify-center py-20">
							<Loader2 className="animate-spin h-7 w-7 text-emerald-600" />
						</div>
					) : (
						<>
							{participantsRefetching && <FetchLoader />}
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
									<div className="p-6 bg-white rounded-md border border-gray-100 shadow-sm">
										<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
											{/* Left column */}
											<div className="space-y-3">
												<div className="text-sm text-gray-700">
													<span className="font-semibold">Nama peserta:</span>
													<span className="ml-2 text-gray-900">
														{data.user?.nama || "-"}
													</span>
												</div>
												<div className="text-sm text-gray-700">
													<span className="font-semibold">Event:</span>
													<span className="ml-2 text-gray-900">
														{data.event?.judul || "-"}
													</span>
												</div>

												<div>
													<div className="text-sm font-semibold text-gray-700 mb-1">
														Catatan
													</div>
													<div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
														{data.catatan || "-"}
													</div>
												</div>
											</div>

											{/* Right column */}
											<div className="space-y-3">
												<div className="flex items-start">
													<div className="text-sm text-gray-700 font-semibold">
														Tanggal Daftar:
													</div>
													<div className="text-sm text-gray-900 ml-2">
														{data.tanggal_daftar
															? new Date(
																	data.tanggal_daftar.replace(" ", "T")
															  ).toLocaleDateString("id-ID", {
																	day: "numeric",
																	month: "long",
																	year: "numeric",
															  })
															: "-"}
													</div>
												</div>

												<div className="flex items-start">
													<div className="text-sm text-gray-700 font-semibold">
														Tanggal Konfirmasi:
													</div>
													<div className="text-sm ml-2">
														{data.tanggal_konfirmasi ? (
															<span className="text-gray-900">
																{new Date(
																	data.tanggal_konfirmasi.replace(" ", "T")
																).toLocaleDateString("id-ID", {
																	day: "numeric",
																	month: "long",
																	year: "numeric",
																})}
															</span>
														) : (
															<Badge variant="secondary">
																Status Belum Dikonfirmasi
															</Badge>
														)}
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
											{searchParticipant
												? "No Matching Participants Found"
												: "No Participants Available"}
										</h3>
										<p className="text-gray-500 mb-4 text-center">
											{searchParticipant
												? "Tidak ada peserta yang sesuai dengan pencarian."
												: "Belum ada data peserta"}
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
