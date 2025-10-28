import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { useAdminEvents } from "@/_hooks/useEvents";
import { useAdminVolunteerUsers } from "@/_hooks/useUsers";
import { useAdminCreateParticipantMutation } from "@/_hooks/useParticipants";
import { parseApiError, toInputDate } from "@/utils";
import DynamicButton from "@/components/ui/Button";
import Skeleton from "@/components/ui/Skeleton";
import { showToast } from "@/components/ui/Toast";

export default function AdminEventParticipantCreate() {
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		event_id: "",
		user_id: "",
		status: "registered",
		tanggal_daftar: toInputDate(new Date().toISOString()),
		tanggal_konfirmasi: "",
		tanggal_hadir: "",
		catatan: "",
	});

	const [submitting, setSubmitting] = useState(false);

	const { data: events = [], isLoading: eventsLoading } = useAdminEvents();
	const { data: volunteers = [], isLoading: volunteersLoading } =
		useAdminVolunteerUsers();

	const createMutation = useAdminCreateParticipantMutation();

	// hanya gunakan event yang sudah dipublish
	// const publishedEvents = events.filter((ev) => ev.status === "published");
	useEffect(() => {
		// jika hanya ada 1 event, set sebagai default
		if (events && events.length === 1 && !formData.event_id) {
			setFormData((s) => ({ ...s, event_id: String(events[0].id) }));
		}
	}, [events]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((s) => {
			// when confirmation date is set, auto-mark status as confirmed
			if (name === "tanggal_konfirmasi") {
				const newStatus = value
					? "confirmed"
					: s.status === "confirmed"
					? "registered"
					: s.status;
				return { ...s, tanggal_konfirmasi: value, status: newStatus };
			}
			return { ...s, [name]: value };
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setSubmitting(true);
		try {
			const payload = new FormData();
			for (const key in formData) {
				payload.append(key, formData[key]);
			}

			await createMutation.mutateAsync(payload);
			toast.success("Participant berhasil dibuat", { position: "top-center" });
			navigate("/admin/event-participants");
		} catch (err) {
			const msg = parseApiError(err);
			showToast({
				type: "error",
				tipIcon: "💡",
				tipText: msg,
				duration: 3000,
				position: "top-center",
			});
			console.error(err);
		} finally {
			setSubmitting(false);
		}
	};

	if (eventsLoading || volunteersLoading)
		return <Skeleton.FormSkeleton title="Loading..." />;

	return (
		<div className="max-w-6xl mx-auto p-6">
			<div
				className="bg-white shadow-xl rounded-lg p-6"
				style={{ minHeight: 520, width: 900 }}>
				<header className="mb-6">
					<h1 className="text-2xl font-semibold text-gray-900">
						Tambah Participant
					</h1>
					<p className="text-sm text-gray-500 mt-1">
						Tambah peserta untuk event tertentu.
					</p>
				</header>

				<form onSubmit={handleSubmit} className="space-y-6">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div>
							<label className="block text-sm font-medium text-gray-700">
								Event
							</label>
							<select
								name="event_id"
								value={formData.event_id}
								required
								onChange={handleChange}
								className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
								<option value="">Pilih event</option>
								{events.map((ev) => (
									<option key={ev.id} value={ev.id}>
										{ev.judul}
									</option>
								))}
							</select>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700">
								Peserta (user)
							</label>
							<select
								name="user_id"
								value={formData.user_id}
								required
								onChange={handleChange}
								className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
								<option value="">Pilih user</option>
								{volunteers.map((volunteer) => (
									<option key={volunteer.id} value={volunteer.id}>
										{volunteer.nama || volunteer.name || volunteer.email}
									</option>
								))}
							</select>
						</div>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div>
							<label className="block text-sm font-medium text-gray-700">
								Tanggal Daftar
							</label>
							<input
								type="date"
								name="tanggal_daftar"
								value={formData.tanggal_daftar}
								onChange={handleChange}
								className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2"
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700">
								Tanggal Konfirmasi
							</label>
							<input
								type="date"
								name="tanggal_konfirmasi"
								value={formData.tanggal_konfirmasi}
								onChange={handleChange}
								className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2"
							/>
						</div>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						{formData.tanggal_konfirmasi && (
							<div>
								<label className="block text-sm font-medium text-gray-700">
									Tanggal Hadir
								</label>
								<input
									type="date"
									name="tanggal_hadir"
									value={formData.tanggal_hadir}
									onChange={handleChange}
									className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2"
								/>
							</div>
						)}
						<div>
							<label className="block text-sm font-medium text-gray-700">
								Status
							</label>
							<select
								name="status"
								value={formData.status}
								required
								onChange={handleChange}
								className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
								<option value="registered">Registered</option>
								<option value="confirmed">Confirmed</option>
								<option value="cancelled">Cancelled</option>
								<option value="attended">Attended</option>
								<option value="no_show">No show</option>
							</select>
						</div>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700">
							Catatan
						</label>
						<textarea
							name="catatan"
							value={formData.catatan}
							onChange={handleChange}
							rows={4}
							className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2"
							placeholder="Catatan (opsional)"
						/>
					</div>

					<div className="flex items-center justify-end gap-3">
						<DynamicButton
							type="button"
							variant="secondary"
							onClick={() => navigate("/admin/event-participants")}>
							Batal
						</DynamicButton>
						<button
							type="submit"
							disabled={submitting}
							className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-500">
							{submitting ? (
								<>
									<Loader2 className="animate-spin h-4 w-4 mr-1 mb-1 inline" />
									Menyimpan...
								</>
							) : (
								"Simpan Participant"
							)}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
