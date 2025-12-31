import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
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

	const {
		register,
		handleSubmit,
		setValue,
		watch,
		getValues,
		formState: { errors, isSubmitting, isSubmitted, isValid },
	} = useForm({
		mode: "onChange",
		defaultValues: {
			event_id: "",
			user_id: "",
			status: "registered",
			tanggal_daftar: toInputDate(new Date().toISOString()),
			tanggal_konfirmasi: "",
			tanggal_hadir: "",
			catatan: "",
		},
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
		// jika hanya ada 1 event, set sebagai default (preserve user edit)
		if (events && events.length === 1 && !getValues("event_id")) {
			setValue("event_id", String(events[0].id), { shouldValidate: false, shouldDirty: true });
		}
	}, [events, getValues, setValue]);

	const tanggal_konfirmasi = watch("tanggal_konfirmasi");
	// sync status when confirmation date changes (preserve user edits)
	useEffect(() => {
		const prevStatus = getValues("status");
		if (tanggal_konfirmasi) {
			setValue("status", "confirmed", { shouldValidate: false, shouldDirty: true });
		} else if (prevStatus === "confirmed") {
			setValue("status", "registered", { shouldValidate: false, shouldDirty: true });
		}
	}, [tanggal_konfirmasi, getValues, setValue]);

	const values_watch = watch();

	const onSubmit = async (values) => {
		const payload = new FormData();
		for (const key in values) {
			payload.append(key, values[key] ?? "");
		}
		await createMutation.mutateAsync(payload);
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

				<form onSubmit={handleSubmit(onSubmit)} className="space-y-6 flex flex-col">
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
						<div>
							<label
								htmlFor="event_id"
								className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
								Event <span className="text-red-500">*</span>
							</label>
							<select
								id="event_id"
								{...register("event_id", { required: "Event wajib dipilih" })}
								className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 text-sm shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
								<option value="">Pilih event</option>
								{events.map((ev) => (
									<option key={ev.id} value={ev.id}>
										{ev.judul}
									</option>
								))}
							</select>
							{isSubmitted && errors.event_id && (
								<p className="text-xs text-red-600 mt-1">{errors.event_id.message}</p>
							)}
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
								<p className="text-xs text-red-600 mt-1">{errors.user_id.message}</p>
							)}
						</div>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
						<div>
							<label
								htmlFor="tanggal_daftar"
								className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
								Tanggal Daftar <span className="text-red-500">*</span>
							</label>
							<input
								id="tanggal_daftar"
								type="date"
								{...register("tanggal_daftar", { required: "Tanggal daftar wajib diisi" })}
								className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 text-sm shadow-sm"
							/>
							{isSubmitted && errors.tanggal_daftar && (
								<p className="text-xs text-red-600 mt-1">{errors.tanggal_daftar.message}</p>
							)}
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
									type="date"
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
								<p className="text-xs text-red-600 mt-1">{errors.status.message}</p>
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
								{isLoading || isSubmitting ? "Membuat..." : "Buat Participant"}
							</Button>
						</div>
					</div>
				</form>
			</div>
		</div>
	);
}
