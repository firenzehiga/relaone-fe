import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAdminEvents } from "@/_hooks/useEvents";
import { useAdminVolunteerUsers } from "@/_hooks/useUsers";
import {
	useAdminParticipantById,
	useAdminUpdateParticipantMutation,
} from "@/_hooks/useParticipants";
import { toInputDate, toInputDatetime } from "@/utils/dateFormatter";
import Button from "@/components/ui/Button";
import Skeleton from "@/components/ui/Skeleton";
import { useAuthStore } from "@/_hooks/useAuth";

export default function AdminEventParticipantEdit() {
	const { id } = useParams();
	const navigate = useNavigate();
	const isDirty = useRef(false);

	const { data: events = [], isLoading: eventsLoading } = useAdminEvents();
	const { data: volunteers = [], isLoading: volunteersLoading } = useAdminVolunteerUsers();
	const { data: showParticipant, isLoading: showLoading } = useAdminParticipantById(id);
	const updateMutation = useAdminUpdateParticipantMutation();

	const [formData, setFormData] = useState({
		event_id: "",
		user_id: "",
		status: "registered",
		tanggal_daftar: "",
		tanggal_konfirmasi: "",
		tanggal_hadir: "",
		catatan: "",
	});

	const { isLoading } = useAuthStore();

	useEffect(() => {
		if (!showParticipant) return;
		setFormData((prev) => {
			if (prev.tanggal_daftar) return prev; // don't overwrite if user edited
			return {
				event_id: showParticipant.event_id || "",
				user_id: showParticipant.user_id || "",
				status: showParticipant.status || "registered",
				tanggal_daftar: toInputDate(showParticipant.tanggal_daftar),
				tanggal_konfirmasi: toInputDate(showParticipant.tanggal_konfirmasi),
				tanggal_hadir: toInputDatetime(showParticipant.tanggal_hadir),
				catatan: showParticipant.catatan || "",
			};
		});
	}, [showParticipant]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		isDirty.current = true;
		setFormData((s) => {
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
		payload.append("_method", "PUT");

		// prepare payload data and normalize tanggal_hadir to include seconds
		const payloadData = { ...formData };
		if (payloadData.tanggal_hadir) {
			// if value is from datetime-local it will contain 'T' (YYYY-MM-DDTHH:mm)
			if (String(payloadData.tanggal_hadir).includes("T")) {
				payloadData.tanggal_hadir = payloadData.tanggal_hadir.replace("T", " ") + ":00";
			}
		}

		for (const key in payloadData) {
			payload.append(key, payloadData[key]);
		}

		updateMutation.mutateAsync({ id, data: payload });

		isDirty.current = false;
	};

	if (eventsLoading || volunteersLoading || showLoading)
		return <Skeleton.FormSkeleton title="Loading..." />;

	return (
		<div className="w-full mx-auto p-4 sm:p-6 max-w-6xl min-h-[calc(100vh-4rem)]">
			<div className="bg-white shadow-xl rounded-lg p-4 sm:p-6">
				<header className="mb-6 sm:mb-8">
					<h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Edit Participant</h1>
					<p className="text-xs sm:text-sm text-gray-500 mt-1">Ubah data participant.</p>
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
								Tanggal Daftar
							</label>
							<input
								type="date"
								name="tanggal_daftar"
								value={formData.tanggal_daftar}
								onChange={handleChange}
								readOnly
								className="mt-1 block w-full rounded-md border bg-gray-50 cursor-not-allowed border-gray-200 px-3 py-2 text-sm shadow-sm "
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
									type="datetime-local"
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
								{isLoading ? "Menyimpan..." : "Simpan Participant"}
							</Button>
						</div>
					</div>
				</form>
			</div>
		</div>
	);
}
