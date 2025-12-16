import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { useAdminEvents } from "@/_hooks/useEvents";
import { useAdminVolunteerUsers } from "@/_hooks/useUsers";
import { useAdminCreateParticipantMutation } from "@/_hooks/useParticipants";
import { toInputDate } from "@/utils/dateFormatter";
import Button from "@/components/ui/Button";
import Skeleton from "@/components/ui/Skeleton";
import { showToast } from "@/components/ui/Toast";
import { useAuthStore } from "@/_hooks/useAuth";

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

	const { isLoading } = useAuthStore();

	const { events, isLoading: eventsLoading, error: eventsError } = useAdminEvents();
	const {
		data: volunteers = [],
		isLoading: volunteersLoading,
		error: volunteersError,
	} = useAdminVolunteerUsers();

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
				const newStatus = value ? "confirmed" : s.status === "confirmed" ? "registered" : s.status;
				return { ...s, tanggal_konfirmasi: value, status: newStatus };
			}
			return { ...s, [name]: value };
		});
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		const payload = new FormData();
		for (const key in formData) {
			payload.append(key, formData[key]);
		}

		createMutation.mutateAsync(payload);
	};

	if (eventsLoading || volunteersLoading) return <Skeleton.FormSkeleton title="Loading..." />;

	if (eventsError || volunteersError) {
		return <p>Error: {eventsError?.message || volunteersError?.message}</p>;
	}

	return (
		<div className="w-full mx-auto p-4 sm:p-6 max-w-6xl min-h-[calc(100vh-4rem)]">
			<div className="bg-white shadow-xl rounded-lg p-4 sm:p-6">
				<header className="mb-6 sm:mb-8">
					<h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Tambah Participant</h1>
					<p className="text-xs sm:text-sm text-gray-500 mt-1">
						Tambah peserta untuk event tertentu.
					</p>
				</header>

				<form onSubmit={handleSubmit} className="space-y-6 flex flex-col">
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
						<div>
							<label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
								Event <span className="text-red-500">*</span>
							</label>
							<select
								name="event_id"
								value={formData.event_id}
								required
								onChange={handleChange}
								className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 text-sm shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
								<option value="">Pilih event</option>
								{events.map((ev) => (
									<option key={ev.id} value={ev.id}>
										{ev.judul}
									</option>
								))}
							</select>
						</div>

						<div>
							<label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
								Peserta (Partisipan) <span className="text-red-500">*</span>
							</label>
							<select
								name="user_id"
								value={formData.user_id}
								required
								onChange={handleChange}
								className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 text-sm shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
								<option value="">Pilih user</option>
								{volunteers.map((volunteer) => (
									<option key={volunteer.id} value={volunteer.id}>
										{volunteer.nama || volunteer.name || volunteer.email}
									</option>
								))}
							</select>
						</div>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
						<div>
							<label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
								Tanggal Daftar <span className="text-red-500">*</span>
							</label>
							<input
								type="date"
								name="tanggal_daftar"
								value={formData.tanggal_daftar}
								onChange={handleChange}
								className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 text-sm shadow-sm"
							/>
						</div>

						<div>
							<label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
								Tanggal Konfirmasi
							</label>
							<input
								type="date"
								name="tanggal_konfirmasi"
								value={formData.tanggal_konfirmasi}
								onChange={handleChange}
								className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 text-sm shadow-sm"
							/>
						</div>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
						{formData.tanggal_konfirmasi && (
							<div>
								<label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
									Tanggal Hadir
								</label>
								<input
									type="date"
									name="tanggal_hadir"
									value={formData.tanggal_hadir}
									onChange={handleChange}
									className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 text-sm shadow-sm"
								/>
							</div>
						)}
						<div>
							<label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
								Status <span className="text-red-500">*</span>
							</label>
							<select
								name="status"
								value={formData.status}
								required
								onChange={handleChange}
								className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 text-sm shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
								<option value="registered">Registered</option>
								<option value="confirmed">Confirmed</option>
								<option value="cancelled">Cancelled</option>
								<option value="attended">Attended</option>
								<option value="no_show">No show</option>
							</select>
						</div>
					</div>

					<div>
						<label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
							Catatan
						</label>
						<textarea
							name="catatan"
							value={formData.catatan}
							onChange={handleChange}
							rows={4}
							className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 text-sm shadow-sm"
							placeholder="Catatan (opsional)"
						/>
					</div>

					<div className="mt-auto pt-6">
						<div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3">
							<Button
								type="button"
								variant="outline"
								disabled={isLoading}
								onClick={() => navigate("/admin/event-participants")}
								className="w-full sm:w-auto order-2 sm:order-1">
								Batal
							</Button>
							<Button
								type="submit"
								variant="success"
								loading={isLoading}
								disabled={isLoading}
								className="w-full sm:w-auto order-1 sm:order-2">
								{isLoading ? "Membuat..." : "Buat Participant"}
							</Button>
						</div>
					</div>
				</form>
			</div>
		</div>
	);
}
