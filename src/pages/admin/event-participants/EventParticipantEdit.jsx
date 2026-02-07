import React, { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useAdminEvents } from "@/_hooks/useEvents";
import { useAdminVolunteerUsers } from "@/_hooks/useUsers";
import {
	useAdminParticipantById,
	useAdminUpdateParticipantMutation,
} from "@/_hooks/useParticipants";
import { toInputDate, toInputDatetime } from "@/utils/dateFormatter";
import Button from "@/components/ui/DynamicButton";
import CustomSkeleton from "@/components/ui/CustomSkeleton";
import { useAuthStore } from "@/_hooks/useAuth";

export default function AdminEventParticipantEdit() {
	const { id } = useParams();
	const navigate = useNavigate();
	const isDirty = useRef(false);

	const { events, isLoading: eventsLoading } = useAdminEvents();
	const { data: volunteers = [], isLoading: volunteersLoading } =
		useAdminVolunteerUsers();
	const { data: showParticipant, isLoading: showLoading } =
		useAdminParticipantById(id);
	const updateMutation = useAdminUpdateParticipantMutation();

	const {
		register,
		handleSubmit,
		setValue,
		watch,
		reset,
		getValues,
		formState: { errors, isSubmitting, isSubmitted, isValid },
	} = useForm({
		mode: "onChange",
		defaultValues: {
			event_id: "",
			user_id: "",
			status: "registered",
			tanggal_daftar: "",
			tanggal_konfirmasi: "",
			tanggal_hadir: "",
			catatan: "",
		},
	});

	const { isLoading } = useAuthStore();

	useEffect(() => {
		if (!showParticipant) return;

		// don't overwrite if user already edited tanggal_daftar
		if (getValues("tanggal_daftar")) return;

		reset({
			event_id: showParticipant.event_id || "",
			user_id: showParticipant.user_id || "",
			status: showParticipant.status || "registered",
			tanggal_daftar: toInputDate(showParticipant.tanggal_daftar),
			tanggal_konfirmasi: toInputDate(showParticipant.tanggal_konfirmasi),
			tanggal_hadir: toInputDatetime(showParticipant.tanggal_hadir),
			catatan: showParticipant.catatan || "",
		});
	}, [showParticipant, reset, getValues]);

	const tanggal_konfirmasi = watch("tanggal_konfirmasi");

	// sync status when confirmation date changes (preserve user edits)
	useEffect(() => {
		const prevStatus = getValues("status");
		if (tanggal_konfirmasi) {
			setValue("status", "confirmed", {
				shouldValidate: false,
				shouldDirty: true,
			});
		} else if (prevStatus === "confirmed") {
			setValue("status", "registered", {
				shouldValidate: false,
				shouldDirty: true,
			});
		}
	}, [tanggal_konfirmasi, getValues, setValue]);

	const onSubmit = async (values) => {
		const payload = new FormData();
		payload.append("_method", "PUT");

		const payloadData = { ...values };
		if (payloadData.tanggal_hadir) {
			if (String(payloadData.tanggal_hadir).includes("T")) {
				payloadData.tanggal_hadir =
					payloadData.tanggal_hadir.replace("T", " ") + ":00";
			}
		}

		for (const key in payloadData) {
			payload.append(key, payloadData[key] ?? "");
		}

		await updateMutation.mutateAsync({ id, data: payload });

		isDirty.current = false;
	};

	if (eventsLoading || volunteersLoading || showLoading)
		return <CustomSkeleton.FormSkeleton title="Loading..." />;

	return (
		<div className="w-full mx-auto p-4 sm:p-6 max-w-6xl min-h-[calc(100vh-4rem)]">
			<div className="bg-white shadow-xl rounded-lg p-4 sm:p-6">
				<header className="mb-6 sm:mb-8">
					<h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
						Edit Participant
					</h1>
					<p className="text-xs sm:text-sm text-gray-500 mt-1">
						Ubah data participant.
					</p>
				</header>

				<form
					onSubmit={handleSubmit(onSubmit)}
					className="space-y-6 flex flex-col">
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
						<div>
							<label
								htmlFor="event_id"
								className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
								Event{" "}
								<span className="text-gray-400 italic text-xs">
									(read only)
								</span>
							</label>
							<select
								id="event_id"
								{...register("event_id")}
								disabled
								className="mt-1 block w-full rounded-md border bg-gray-50 cursor-not-allowed border-gray-200 px-3 py-2 text-sm shadow-sm ">
								<option value="">Pilih event</option>
								{events.map((ev) => (
									<option key={ev.id} value={ev.id}>
										{ev.judul}
									</option>
								))}
							</select>
						</div>

						<div>
							<label
								htmlFor="user_id"
								className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
								Peserta (Partisipan) <span className="text-red-500">*</span>
							</label>
							<select
								id="user_id"
								{...register("user_id", { required: "User wajib dipilih" })}
								className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 text-sm shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
								<option value="">Pilih user</option>
								{volunteers.map((volunteer) => (
									<option key={volunteer.id} value={volunteer.id}>
										{volunteer.nama}
									</option>
								))}
							</select>
							{isSubmitted && errors.user_id && (
								<p className="text-xs text-red-600 mt-1">
									{errors.user_id.message}
								</p>
							)}
						</div>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
						<div>
							<label
								htmlFor="tanggal_daftar"
								className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
								Tanggal Daftar{" "}
								<span className="text-gray-400 italic text-xs">
									(read only)
								</span>
							</label>
							<input
								id="tanggal_daftar"
								type="date"
								{...register("tanggal_daftar")}
								readOnly
								className="mt-1 block w-full rounded-md border bg-gray-50 cursor-not-allowed border-gray-200 px-3 py-2 text-sm shadow-sm "
							/>
						</div>

						<div>
							<label
								htmlFor="tanggal_konfirmasi"
								className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
								Tanggal Konfirmasi
							</label>
							<input
								id="tanggal_konfirmasi"
								type="date"
								{...register("tanggal_konfirmasi")}
								className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 text-sm shadow-sm"
							/>
						</div>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
						{tanggal_konfirmasi && (
							<div>
								<label
									htmlFor="tanggal_hadir"
									className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
									Tanggal Hadir
								</label>
								<input
									id="tanggal_hadir"
									type="datetime-local"
									{...register("tanggal_hadir")}
									className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 text-sm shadow-sm"
								/>
							</div>
						)}
						<div>
							<label
								htmlFor="status"
								className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
								Status <span className="text-red-500">*</span>
							</label>
							<select
								id="status"
								{...register("status", { required: "Status wajib dipilih" })}
								className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 text-sm shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
								<option value="registered">Registered</option>
								<option value="confirmed">Confirmed</option>
								<option value="cancelled">Cancelled</option>
								<option value="attended">Attended</option>
								<option value="no_show">No show</option>
							</select>
							{isSubmitted && errors.status && (
								<p className="text-xs text-red-600 mt-1">
									{errors.status.message}
								</p>
							)}
						</div>
					</div>

					<div>
						<label
							htmlFor="catatan"
							className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
							Catatan
						</label>
						<textarea
							id="catatan"
							{...register("catatan")}
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
								loading={isLoading || isSubmitting}
								disabled={isLoading || isSubmitting || !isValid}
								className="w-full sm:w-auto order-1 sm:order-2">
								{isLoading || isSubmitting
									? "Menyimpan..."
									: "Simpan Participant"}
							</Button>
						</div>
					</div>
				</form>
			</div>
		</div>
	);
}
