import { useMemo, useState } from "react";

// UI Libraries
import DataTable from "react-data-table-component";
import { QRCodeCanvas } from "qrcode.react";
import { toast } from "react-hot-toast";
import Swal from "sweetalert2";
import {
	ChevronDown,
	Loader2,
	EllipsisVerticalIcon,
	AlertCircle,
	Filter,
	X,
	Calendar,
	Users,
	QrCode,
	Scan,
	Download,
	Check,
	UserX,
} from "lucide-react";
import { Menu, MenuButton, MenuList, MenuItem, Portal, IconButton } from "@chakra-ui/react";

// Hooks / Stores
import { useAuthStore } from "@/_hooks/useAuth";
import {
	useOrgParticipants,
	useOrgDownloadQrMutation,
	useOrgConfirmParticipantMutation,
	useOrgRejectParticipantMutation,
	useOrgUpdateNoShowMutation,
} from "@/_hooks/useParticipants";

// Helpers
import { formatDate, formatDateTime } from "@/utils/dateFormatter";

// UI Components
import FetchLoader from "@/components/ui/FetchLoader";
import { LinkButton } from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";

export default function OrganizationEventParticipant() {
	const {
		data: participants = [],
		isLoading: participantsLoading,
		error: participantsError,
		isFetching: participantsRefetching,
	} = useOrgParticipants();

	const { isLoading } = useAuthStore();

	const downloadQrMutation = useOrgDownloadQrMutation();
	const updateNoShowMutation = useOrgUpdateNoShowMutation();

	// const deleteParticipantMutation = useOrgDeleteParticipantMutation();

	// Local state for search/filter
	const [searchParticipant, setSearchParticipant] = useState("");
	const [selectedEventId, setSelectedEventId] = useState("all");
	const [qrDataMap, setQrDataMap] = useState({}); // Store QR data + export size for each participant

	// Handle download QR code (simple approach like volunteer QR)
	const handleDownloadQR = (participant) => {
		downloadQrMutation.mutate(participant.id, {
			onSuccess: (response) => {
				if (!response.success) return;

				const qrData = response.data.qr_code;
				const volunteerName = (response.data.volunteer?.nama || "volunteer").replace(/\s+/g, "_");
				const eventName = (response.data.event?.judul || "event").replace(/\s+/g, "_");

				// Store QR data temporarily for rendering
				setQrDataMap((prev) => ({
					...prev,
					[participant.id]: qrData,
				}));

				// Poll canvas until it has actual QR content
				let attempts = 0;
				const maxAttempts = 20; // Max 2 seconds

				const checkAndDownload = () => {
					attempts++;
					const canvas = document.getElementById(`qr-canvas-${participant.id}`);

					// Canvas not ready yet, retry
					if (!canvas && attempts < maxAttempts) {
						setTimeout(checkAndDownload, 100);
						return;
					}

					// Timeout - canvas not found
					if (!canvas) {
						toast.error("Gagal generate QR Code - timeout");
						setQrDataMap((prev) => {
							const copy = { ...prev };
							delete copy[participant.id];
							return copy;
						});
						return;
					}

					// Check if canvas has actual QR content (not blank)
					try {
						const ctx = canvas.getContext("2d");
						const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
						const pixels = imageData.data;

						// Check for non-white pixels
						let hasContent = false;
						for (let i = 0; i < pixels.length; i += 4) {
							if (pixels[i] < 250 || pixels[i + 1] < 250 || pixels[i + 2] < 250) {
								hasContent = true;
								break;
							}
						}

						// No content yet, retry
						if (!hasContent && attempts < maxAttempts) {
							setTimeout(checkAndDownload, 100);
							return;
						}

						// Still no content after timeout
						if (!hasContent) {
							toast.error("QR Code gagal render - silakan coba lagi");
							setQrDataMap((prev) => {
								const copy = { ...prev };
								delete copy[participant.id];
								return copy;
							});
							return;
						}
					} catch (err) {
						console.warn("Canvas check error:", err);
						// Continue with download anyway
					}

					// Canvas has content, download it
					const pngUrl = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");

					const link = document.createElement("a");
					link.href = pngUrl;
					link.download = `QR_${volunteerName}_${eventName}.png`;
					document.body.appendChild(link);
					link.click();
					document.body.removeChild(link);

					toast.success(
						`QR Code untuk ${response.data.volunteer?.nama || "volunteer"} berhasil didownload`,
						{
							position: "top-center",
						}
					);

					// Cleanup
					setQrDataMap((prev) => {
						const copy = { ...prev };
						delete copy[participant.id];
						return copy;
					});
				};

				setTimeout(checkAndDownload, 100);
			},
		});
	};

	// Get unique events from participants
	const eventsList = useMemo(() => {
		const eventsMap = new Map();
		participants.forEach((p) => {
			if (p.event?.id && p.event?.judul) {
				if (!eventsMap.has(p.event.id)) {
					eventsMap.set(p.event.id, {
						id: p.event.id,
						judul: p.event.judul,
						tanggal_mulai: p.event.tanggal_mulai,
						tanggal_selesai: p.event.tanggal_selesai,
						waktu_mulai: p.event.waktu_mulai,
						waktu_selesai: p.event.waktu_selesai,
						count: 0,
					});
				}
				eventsMap.get(p.event.id).count++;
			}
		});
		return Array.from(eventsMap.values()).sort((a, b) => a.judul.localeCompare(b.judul));
	}, [participants]);

	// Get selected event info
	const selectedEvent = useMemo(() => {
		if (selectedEventId === "all") return null;
		return eventsList.find((e) => e.id === parseInt(selectedEventId));
	}, [selectedEventId, eventsList]);

	// Simple check if event is finished
	const isEventCompleted = useMemo(() => {
		if (!selectedEvent?.tanggal_selesai) return false;
		const today = new Date();
		const endDate = new Date(selectedEvent.tanggal_selesai);
		endDate.setHours(23, 59, 59, 999); // artinya sampai akhir hari

		return endDate < today;
	}, [selectedEvent]);

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

	// Fungsi konfirmasi participant
	const confirmParticipantMutation = useOrgConfirmParticipantMutation();
	const handleConfirm = (id) => {
		Swal.fire({
			title: "Apa Anda yakin?",
			text: "Kamu tidak akan bisa mengembalikan ini!",
			showCancelButton: true,
			confirmButtonText: "Ya, konfirmasi!",
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
				confirmParticipantMutation.mutate(id);
			}
		});
	};

	// Fungsi konfirmasi participant
	const rejectedParticipantMutation = useOrgRejectParticipantMutation();
	const handleReject = (id) => {
		Swal.fire({
			title: "Apa Anda yakin?",
			text: "Kamu tidak akan bisa mengembalikan ini!",
			showCancelButton: true,
			confirmButtonText: "Ya, tolak!",
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
				rejectedParticipantMutation.mutate(id);
			}
		});
	};

	// Fungsi update no show participants
	const handleUpdateNoShow = () => {
		if (selectedEventId === "all") {
			toast.error("Pilih kegiatan terlebih dahulu untuk perbarui status tidak hadir", {
				position: "top-center",
			});
			return;
		}

		// Count participants yang masih confirmed (for display only)
		const confirmedCount = filteredParticipants.filter((p) => p.status === "confirmed").length;

		Swal.fire({
			title: "Perbarui Status Tidak Hadir?",
			html: `<div class="text-left">
				<p class="mb-2">Kegiatan: <strong>${selectedEvent?.judul}</strong></p>
				${
					confirmedCount > 0
						? `<p class="mb-2">Partisipan dengan status "Dikonfirmasi": <strong>${confirmedCount} orang</strong></p>`
						: '<p class="mb-2 text-gray-600">Sistem akan mengecek partisipan yang perlu diupdate...</p>'
				}
				<p class="text-red-600 mt-4">⚠️ Semua partisipan yang masih berstatus "Dikonfirmasi" akan diubah menjadi "Tidak Hadir".</p>
				<p class="text-sm text-gray-500 mt-2">Note: Kegiatan harus sudah selesai untuk melakukan perbarui ini.</p>
			</div>`,
			icon: "warning",
			showCancelButton: true,
			confirmButtonText: "Ya, Perbarui!",
			cancelButtonText: "Batal",
			customClass: {
				popup: "bg-white rounded-xl shadow-xl p-5 max-w-md w-full",
				title: "text-lg font-semibold text-gray-900",
				htmlContainer: "text-sm text-gray-600",
				actions: "flex gap-3 justify-center mt-4",
				confirmButton:
					"px-4 py-2 focus:outline-none rounded-md bg-red-500 hover:bg-red-600 text-white",
				cancelButton:
					"px-4 py-2 rounded-md border border-gray-300 bg-gray-200 hover:bg-gray-300 text-gray-700",
			},
			backdrop: true,
		}).then((result) => {
			if (result.isConfirmed) {
				updateNoShowMutation.mutate(selectedEventId);
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
			name: "Partisipan",
			selector: (row) => row.user?.nama || "-",
			sortable: true,
			wrap: true,
			width: "180px",
		},
		{
			name: "Kegiatan yang diikuti",
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
					) : row.status === "cancelled" ? (
						<Badge variant={"danger"}>Dibatalkan</Badge>
					) : row.status === "confirmed" ? (
						<Badge variant={"primary"}>Dikonfirmasi</Badge>
					) : row.status === "attended" ? (
						<Badge variant={"success"}>Hadir</Badge>
					) : row.status === "no_show" ? (
						<Badge variant={"danger"}>Tidak Hadir</Badge>
					) : row.status === "rejected" ? (
						<Badge variant={"danger"}>Ditolak</Badge>
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
			cell: (row) => {
				// Tidak tampilkan tombol aksi untuk status rejected atau attended
				if (
					row.status === "rejected" ||
					row.status === "cancelled" ||
					row.status === "attended" ||
					row.status === "no_show"
				) {
					return (
						<span className="text-xs text-gray-400 italic">
							{row.status === "attended" ? "Sudah hadir" : "Tidak ada aksi"}
						</span>
					);
				}

				// Check if event is completed - disable actions
				if (isLoading) return <Loader2 className="text-emerald-600 animate-spin" />; // Show spinner while isLoading

				if (isEventCompleted)
					return <span className="text-xs text-gray-400 italic">Kegiatan sudah selesai</span>;
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
								{/* Download QR - Only for confirmed and event not completed */}
								{row.status === "confirmed" && !isEventCompleted && (
									<MenuItem
										icon={<Download className="text-blue-500 hover:text-blue-600" />}
										onClick={() => handleDownloadQR(row)}
										isDisabled={downloadQrMutation.isPending}>
										{downloadQrMutation.isPending ? "Downloading..." : "QR Code"}
									</MenuItem>
								)}
								{/* Confirm/Reject - Only for registered and event not completed */}
								{row.status === "registered" && !isEventCompleted && (
									<>
										<MenuItem
											onClick={() => handleConfirm(row.id)}
											disabled={isLoading}
											icon={<Check className="text-green-500 hover:text-green-600" />}>
											Konfirmasi
										</MenuItem>
										<MenuItem
											onClick={() => handleReject(row.id)}
											disabled={isLoading}
											icon={<X className="text-red-500 hover:text-red-600" />}>
											Tolak
										</MenuItem>
									</>
								)}
							</MenuList>
						</Portal>
					</Menu>
				);
			},
			width: "120px",
		},
	];

	if (participantsError) {
		return (
			<div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
				<div className="flex flex-col items-center justify-center  text-gray-600">
					<AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
					<h3 className="text-lg font-semibold mb-2">Error</h3>
					<p className="text-gray-500 mb-4 text-center">Gagal mengambil data participant.</p>
					<p className="text-red-500 mb-4 text-center font-semibold">{participantsError.message}</p>
				</div>
			</div>
		);
	}

	return (
		<div className="py-8 bg-emerald-100 page-transition min-h-screen">
			<div className="max-w-6xl mx-auto px-4">
				<div className="bg-white rounded-lg shadow p-6">
					<div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-3">
						<h2 className="text-lg font-semibold">
							{participantsRefetching ? (
								<FetchLoader variant="inline" text="Mengambil Data Terbaru..." />
							) : (
								"Daftar Partisipan (Relawan)"
							)}
						</h2>

						{/* Action Buttons */}
						<div className="flex gap-2">
							{/* Tombol Update No Show */}
							{selectedEventId !== "all" && (
								<button
									onClick={handleUpdateNoShow}
									disabled={updateNoShowMutation.isPending}
									className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md text-sm font-medium transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed">
									<UserX className="w-4 h-4" />
									{updateNoShowMutation.isPending ? "Memperbarui..." : "Perbarui Status"}
								</button>
							)}

							{/* Tombol Scanner */}
							{selectedEventId !== "all" && (
								<LinkButton
									variant="success"
									className="flex items-center gap-2"
									to={`/organization/event-participants/scanner/${selectedEventId}`}>
									<Scan className="w-4 h-4" />
									Buka Presensi
								</LinkButton>
							)}
						</div>
					</div>

					{/* Event Info Banner - Simple */}
					{selectedEvent && (
						<div
							className={`mb-4 rounded-lg p-4 border ${
								isEventCompleted
									? "bg-gradient-to-r from-gray-50 to-slate-50 border-gray-300"
									: "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200"
							}`}>
							<div className="flex items-center justify-between flex-wrap gap-2">
								<div className="flex items-center gap-3">
									<Calendar
										className={`w-6 h-6 flex-shrink-0 ${
											isEventCompleted ? "text-gray-600" : "text-blue-600"
										}`}
									/>
									<div>
										<h3
											className={`text-sm font-semibold mb-1 ${
												isEventCompleted ? "text-gray-900" : "text-blue-900"
											}`}>
											{selectedEvent.judul}
										</h3>
										<p
											className={`text-xs ${isEventCompleted ? "text-gray-700" : "text-blue-700"}`}>
											{formatDate(selectedEvent.tanggal_mulai)} -{" "}
											{formatDate(selectedEvent.tanggal_selesai)}
										</p>
									</div>
								</div>
								<div>
									{isEventCompleted ? (
										<Badge variant="success" className="text-sm">
											🟢Kegiatan Sudah Selesai
										</Badge>
									) : (
										<Badge variant="warning" className="text-sm">
											🟠 Kegiatan Aktif
										</Badge>
									)}
								</div>
							</div>
						</div>
					)}

					{/* Quick Scanner Access Banner */}
					{selectedEventId === "all" && eventsList.length > 0 && (
						<div className="mb-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
							<div className="flex items-start gap-3">
								<QrCode className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
								<div className="flex-1">
									<h3 className="text-sm font-semibold text-blue-900 mb-1">
										Fitur Manajemen Kehadiran
									</h3>
									<p className="text-sm text-blue-700 mb-3">
										Pilih kegiatan terlebih dahulu untuk mengakses fitur scanner check-in dan
										perbarui status kehadiran
									</p>
									<div className="text-xs text-blue-600 space-y-1">
										<div>
											� <strong>Scanner Presensi:</strong> Scan kode QR volunteer untuk check-in
											realtime
										</div>
										<div>
											⏰ <strong>Perbarui Status:</strong> Ubah status partisipan yang tidak hadir
											setelah kegiatan selesai
										</div>
									</div>
								</div>
							</div>
						</div>
					)}

					{participantsLoading ? (
						<div className="flex h-96 justify-center py-20">
							<Loader2 className="animate-spin h-7 w-7 text-emerald-600" />
						</div>
					) : (
						<>
							{/* Stats Cards */}
							<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
								<div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
									<div className="flex items-center justify-between">
										<div>
											<p className="text-sm text-blue-600 font-medium">Total Kegiatan</p>
											<p className="text-2xl font-bold text-blue-900">{eventsList.length}</p>
										</div>
										<Calendar className="w-10 h-10 text-blue-500 opacity-70" />
									</div>
								</div>
								<div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg p-4 border border-emerald-200">
									<div className="flex items-center justify-between">
										<div>
											<p className="text-sm text-emerald-600 font-medium">Total Partisipan</p>
											<p className="text-2xl font-bold text-emerald-900">{participants.length}</p>
										</div>
										<Users className="w-10 h-10 text-emerald-500 opacity-70" />
									</div>
								</div>
								<div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
									<div className="flex items-center justify-between">
										<div>
											<p className="text-sm text-purple-600 font-medium">Total Hasil Filter</p>
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
										Filter berdasarkan Kegiatan
									</label>
									<select
										value={selectedEventId}
										onChange={(e) => setSelectedEventId(e.target.value)}
										className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white">
										<option value="all">Semua Kegiatan</option>
										{eventsList.map((event) => (
											<option key={event.id} value={event.id}>
												{event.judul}
											</option>
										))}
									</select>
								</div>
								<div className="flex-1">
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Cari Partisipan
									</label>
									<div className="relative">
										<input
											type="text"
											placeholder="Cari partisipan, kegiatan, status..."
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
													<span className="font-semibold">Nama partisipan:</span>
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
												<div className="flex items-start">
													<div className="text-sm text-gray-700 font-semibold">
														Waktu Kehadiran:
													</div>
													<div className="text-sm ml-2">
														{data.tanggal_hadir ? (
															<span className="text-gray-900">
																{formatDateTime(data.tanggal_hadir, "WIB")}{" "}
															</span>
														) : (
															<span className="text-gray-500 italic">Belum Check-In</span>
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
												? "Tidak ada partisipan yang sesuai dengan pencarian."
												: "Belum ada data partisipan"}
										</p>
									</div>
								}
							/>

							{/* Hidden QR Code Canvases for download */}
							<div style={{ position: "absolute", left: "-9999px" }}>
								{Object.entries(qrDataMap).map(([participantId, qrData]) => (
									<QRCodeCanvas
										key={participantId}
										id={`qr-canvas-${participantId}`}
										value={qrData}
										size={512}
										level="H"
										includeMargin={true}
									/>
								))}
							</div>
						</>
					)}
				</div>
			</div>
		</div>
	);
}
