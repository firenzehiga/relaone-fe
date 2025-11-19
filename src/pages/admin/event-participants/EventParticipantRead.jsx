import { useAdminDeleteParticipantMutation, useAdminParticipants } from "@/_hooks/useParticipants";
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
	Filter,
	X,
	Calendar,
	Users,
} from "lucide-react";
import { Menu, MenuButton, MenuList, MenuItem, Portal, IconButton } from "@chakra-ui/react";
import { useMemo, useState } from "react";
import DataTable from "react-data-table-component";
import { Link } from "react-router-dom";
import FetchLoader from "@/components/ui/FetchLoader";
import { parseApiError } from "@/utils";
import { formatDate } from "@/utils/dateFormatter";
import Badge from "@/components/ui/Badge";

export default function AdminEventParticipant() {
	const {
		data: participants = [],
		isLoading: participantsLoading,
		error: participantsError,
		isFetching: participantsRefetching,
	} = useAdminParticipants();

	const deleteParticipantMutation = useAdminDeleteParticipantMutation();

	// Local state for search/filter
	const [searchParticipant, setSearchParticipant] = useState("");
	const [selectedEventId, setSelectedEventId] = useState("all");

	// Get unique events from participants
	const eventsList = useMemo(() => {
		const eventsMap = new Map();
		participants.forEach((p) => {
			if (p.event?.id && p.event?.judul) {
				if (!eventsMap.has(p.event.id)) {
					eventsMap.set(p.event.id, {
						id: p.event.id,
						judul: p.event.judul,
						count: 0,
					});
				}
				eventsMap.get(p.event.id).count++;
			}
		});
		return Array.from(eventsMap.values()).sort((a, b) => a.judul.localeCompare(b.judul));
	}, [participants]);

	const filteredParticipants = useMemo(() => {
		let filtered = participants;

		// Filter by selected event
		if (selectedEventId !== "all") {
			filtered = filtered.filter((p) => p.event?.id === parseInt(selectedEventId));
		}

		// Filter by search query
		if (searchParticipant) {
			const query = searchParticipant.toLowerCase();
			filtered = filtered.filter((participantItem) => {
				const peserta = String(participantItem.user?.nama || "").toLowerCase();
				const event = String(participantItem.event?.judul || "").toLowerCase();
				const status = String(participantItem.status || "").toLowerCase();
				return peserta.includes(query) || event.includes(query) || status.includes(query);
			});
		}

		return filtered;
	}, [participants, searchParticipant, selectedEventId]);

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
				deleteParticipantMutation.mutate(id, {
					onSuccess: () => {
						toast.success("Participant berhasil dihapus.", {
							position: "top-center",
						});
					},
					onError: (err) => {
						// ambil pesan backend kalau ada, fallback ke err.message
						const msg = parseApiError(err) || "Gagal menghapus participant.";
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
			selector: (row) => formatDate(row.tanggal_daftar) || "-",
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
					) : row.status === "no_show" ? (
						<Badge variant={"danger"}>Tidak Hadir</Badge>
					) : (
						<Badge variant={"danger"}>{row.status || "-"}</Badge>
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
							<Link to={`/admin/event-participants/edit/${row.id}`} className="w-full">
								<MenuItem icon={<EditIcon className="text-yellow-500 hover:text-yellow-600" />}>
									Edit
								</MenuItem>
							</Link>
							<MenuItem
								onClick={() => handleDelete(row.id)}
								disabled={deleteParticipantMutation.isLoading}
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
				<p className="text-gray-500 mb-4 text-center">Gagal mengambil data participant.</p>
				<p className="text-red-500 mb-4 text-center font-semibold">{participantsError.message}</p>
			</div>
		);
	}

	return (
		<div className="py-8 page-transition min-h-screen">
			<div className="max-w-6xl mx-auto px-4">
				<div className="bg-white rounded-lg shadow p-6">
					<div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-3">
						<h2 className="text-lg font-semibold">
							{" "}
							{participantsRefetching ? (
								<FetchLoader variant="inline" text="Mengambil Data Terbaru..." />
							) : (
								"Daftar Participant"
							)}
						</h2>
						<LinkButton
							to="/admin/event-participants/create"
							variant="success"
							size="sm"
							className="w-full md:w-auto">
							<Plus className="w-4 h-4 mr-2" /> Tambah Event Participant
						</LinkButton>
					</div>

					{participantsLoading ? (
						<div className="flex h-96 justify-center py-20">
							{" "}
							<Loader2 className="animate-spin h-7 w-7 text-emerald-600" />
						</div>
					) : (
						<>
							{/* Stats Cards */}
							<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
								<div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
									<div className="flex items-center justify-between">
										<div>
											<p className="text-sm text-blue-600 font-medium">Total Events</p>
											<p className="text-2xl font-bold text-blue-900">{eventsList.length}</p>
										</div>
										<Calendar className="w-10 h-10 text-blue-500 opacity-70" />
									</div>
								</div>
								<div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg p-4 border border-emerald-200">
									<div className="flex items-center justify-between">
										<div>
											<p className="text-sm text-emerald-600 font-medium">Total Participants</p>
											<p className="text-2xl font-bold text-emerald-900">{participants.length}</p>
										</div>
										<Users className="w-10 h-10 text-emerald-500 opacity-70" />
									</div>
								</div>
								<div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
									<div className="flex items-center justify-between">
										<div>
											<p className="text-sm text-purple-600 font-medium">Filtered Results</p>
											<p className="text-2xl font-bold text-purple-900">
												{filteredParticipants.length}
											</p>
										</div>
										<Filter className="w-10 h-10 text-purple-500 opacity-70" />
									</div>
								</div>
							</div>

							{/* Filters */}
							<div className="flex flex-col md:flex-row gap-4 mb-4">
								<div className="flex-1">
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Filter berdasarkan Event
									</label>
									<select
										value={selectedEventId}
										onChange={(e) => setSelectedEventId(e.target.value)}
										className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white">
										<option value="all">Semua Event ({participants.length})</option>
										{eventsList.map((event) => (
											<option key={event.id} value={event.id}>
												{event.judul} ({event.count})
											</option>
										))}
									</select>
								</div>
								<div className="flex-1">
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Cari Peserta
									</label>
									<div className="relative">
										<input
											type="text"
											placeholder="Cari peserta, event, status..."
											value={searchParticipant}
											onChange={(e) => setSearchParticipant(e.target.value)}
											className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-emerald-500 pr-8"
										/>
										{searchParticipant && (
											<button
												onClick={() => setSearchParticipant("")}
												className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
												<X className="w-4 h-4" />
											</button>
										)}
									</div>
								</div>
							</div>

							{/* Active Filters Display */}
							{(selectedEventId !== "all" || searchParticipant) && (
								<div className="mb-4 flex flex-wrap gap-2">
									<span className="text-sm text-gray-600">Filter aktif:</span>
									{selectedEventId !== "all" && (
										<Badge variant="primary" className="flex items-center gap-1">
											Event:{" "}
											{eventsList.find((e) => e.id === parseInt(selectedEventId))?.judul ||
												"Unknown"}
											<button
												onClick={() => setSelectedEventId("all")}
												className="ml-1 hover:text-white">
												<X className="w-3 h-3" />
											</button>
										</Badge>
									)}
									{searchParticipant && (
										<Badge variant="secondary" className="flex items-center gap-1">
											Search: {searchParticipant}
											<button
												onClick={() => setSearchParticipant("")}
												className="ml-1 hover:text-gray-800">
												<X className="w-3 h-3" />
											</button>
										</Badge>
									)}
									<button
										onClick={() => {
											setSelectedEventId("all");
											setSearchParticipant("");
										}}
										className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
										Reset semua filter
									</button>
								</div>
							)}
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
													<span className="ml-2 text-gray-900">{data.user?.nama || "-"}</span>
												</div>
												<div className="flex items-start">
													<div className="text-sm text-gray-700 font-semibold">Tanggal:</div>
													<div className="text-sm text-gray-900 ml-2">
														{formatDate(data.event?.tanggal_mulai) || "-"} -{" "}
														{formatDate(data.event?.tanggal_selesai) || "-"}
													</div>
												</div>

												<div>
													<div className="text-sm font-semibold text-gray-700 mb-1">Catatan</div>
													<div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
														{data.catatan || "-"}
													</div>
												</div>
											</div>

											{/* Right column */}
											<div className="space-y-3">
												<div className="flex items-start">
													<div className="text-sm text-gray-700 font-semibold">Tanggal Daftar:</div>
													<div className="text-sm text-gray-900 ml-2">
														{formatDate(data.tanggal_daftar) || "-"}
													</div>
												</div>

												<div className="flex items-start">
													<div className="text-sm text-gray-700 font-semibold">
														Tanggal Konfirmasi:
													</div>
													<div className="text-sm ml-2">
														{data.tanggal_konfirmasi ? (
															<span className="text-gray-900">
																{formatDate(data.tanggal_konfirmasi)}
															</span>
														) : (
															<Badge variant="default">Belum Dikonfirmasi</Badge>
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
