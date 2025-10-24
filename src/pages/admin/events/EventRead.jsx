import { useMemo, useState } from "react";
import DataTable from "react-data-table-component";
import { useAdminEvents } from "@/_hooks/useEvents";
import { ChevronDown, Plus, Loader2, Trash, PencilIcon } from "lucide-react";
import Button from "@/components/ui/Button";

export default function AdminEvent() {
	const {
		data: events,
		isLoading: eventsLoading,
		error: eventsError,
	} = useAdminEvents();

	// Local state for search/filter
	const [searchEvent, setSearchEvent] = useState("");

	const filteredEvents = useMemo(() => {
		if (!searchEvent) return events;
		const query = searchEvent.toLowerCase();
		return events.filter((eventItem) => {
			const title = String(eventItem.judul || "").toLowerCase();
			const description = String(eventItem.deskripsi || "").toLowerCase();
			const location = String(eventItem.lokasi || "").toLowerCase();
			return (
				title.includes(query) ||
				description.includes(query) ||
				location.includes(query)
			);
		});
	}, [events, searchEvent]);

	const columns = [
		{
			name: "No",
			cell: (row, index) => index + 1,
			sortable: false,
			width: "60px",
		},
		{
			name: "Judul",
			selector: (row) => row.judul || "-",
			sortable: true,
			wrap: true,
			width: "300px",
		},
		{
			name: "Deskripsi",
			selector: (row) => row.deskripsi_singkat,
			sortable: false,
			wrap: true,
		},
		{
			name: "Tanggal",
			selector: (row) =>
				row.tanggal_mulai
					? new Date(row.tanggal_mulai.replace(" ", "T")).toLocaleDateString(
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
			name: "Organisasi",
			selector: (row) => row.organization?.nama || "-",
			sortable: true,
			width: "220px",
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
					<h1 className="text-2xl font-bold text-gray-900">Data Event</h1>
					<p className="text-gray-600">Kelola data event di sini</p>
				</div>

				<div className="bg-white rounded-lg shadow p-6">
					<div className="flex justify-between items-center mb-4">
						<h2 className="text-lg font-semibold">Daftar Event</h2>
						<Button variant="success" size="sm">
							<Plus className="w-4 h-4 mr-2" /> Tambah Event
						</Button>
					</div>

					{eventsLoading ? (
						<div className="flex h-96 justify-center py-20">
							{" "}
							<Loader2 className="animate-spin h-7 w-7 text-emerald-600" />
						</div>
					) : eventsError ? (
						<div className="text-red-600">
							Error loading events: {eventsError.message}
						</div>
					) : events.length === 0 ? (
						<div className="flex flex-col items-center justify-center h-48 text-gray-600">
							<h3 className="text-lg font-semibold mb-2">
								No Events Available
							</h3>
							<p className="text-gray-500">Belum ada data event.</p>
						</div>
					) : (
						<>
							<div className="w-80 mb-4">
								<input
									type="text"
									placeholder="Cari judul, deskripsi, atau lokasi..."
									value={searchEvent}
									onChange={(e) => setSearchEvent(e.target.value)}
									className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-emerald-500"
								/>
							</div>
							<DataTable
								columns={columns}
								data={filteredEvents}
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
											<strong>Judul:</strong> {data.judul || "-"}
										</p>
										<p className="text-sm text-gray-600 mt-2">
											<strong>Deskripsi:</strong>
										</p>
										<p className="text-sm text-gray-800 mt-1">
											{data.deskripsi || "-"}
										</p>
										{data.lokasi && (
											<p className="text-sm text-gray-600 mt-2">
												<strong>Lokasi:</strong> {data.lokasi}
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
