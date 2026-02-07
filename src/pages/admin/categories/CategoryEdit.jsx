import { useAdminCategoryById, useAdminUpdateCategoryMutation } from "@/_hooks/useCategories";
import { Activity, Heart, Leaf, Users, BookOpen, Stethoscope } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import CustomSkeleton from "@/components/ui/CustomSkeleton";
import Button from "@/components/ui/DynamicButton";
import { useAuthStore } from "@/_hooks/useAuth";

export default function AdminCategoryEdit() {
	const { id } = useParams();
	const navigate = useNavigate();
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
		defaultValues: { nama: "", deskripsi: "", icon: "", warna: "#000000", is_active: "1" },
	});
	const { isLoading } = useAuthStore();

	const updateCategoryMutation = useAdminUpdateCategoryMutation();

	const { data: showCategory, isLoading: showCategoryLoading } = useAdminCategoryById(id);

	useEffect(() => {
		if (!showCategory) return;

		// only populate when user hasn't started editing (preserve local edits)
		if (getValues("nama")) return;

		reset({
			nama: showCategory.nama,
			deskripsi: showCategory.deskripsi,
			icon: showCategory.icon,
			warna: showCategory.warna || "#000000",
			is_active: showCategory.is_active === true ? "1" : "0",
		});
	}, [showCategory, reset, getValues]);
	const warna = watch("warna");
	const iconValue = watch("icon");

	const onSubmit = async (values) => {
		const payload = new FormData();
		payload.append("_method", "PUT");

		for (const key in values) {
			let val = values[key];
			if (key === "is_active") val = String(val);
			payload.append(key, val ?? "");
		}

		await updateCategoryMutation.mutateAsync({ id, data: payload });
	};

	if (showCategoryLoading) return <CustomSkeleton.FormSkeleton title="Loading..." />;

	return (
		<div className="w-full mx-auto p-4 sm:p-6 max-w-6xl min-h-[calc(100vh-4rem)]">
			<div className="bg-white shadow-xl rounded-lg p-4 sm:p-6">
				<header className="mb-6 sm:mb-8">
					<h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Edit Kategori</h1>
					<p className="text-xs sm:text-sm text-gray-500 mt-1">Isi detail kategori.</p>
				</header>

				<form onSubmit={handleSubmit(onSubmit)} className="space-y-6 flex flex-col">
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
						<div>
							<label
								htmlFor="nama"
								className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
								Nama Kategori <span className="text-red-500">*</span>
							</label>
							<input
								id="nama"
								type="text"
								placeholder="Contoh:Pendidikan"
								{...register("nama", { required: "Nama kategori wajib diisi" })}
								className={`mt-1 block w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
									isSubmitted && errors.nama ? "border-red-500" : "border-gray-200"
								}`}
							/>
						</div>
						<div>
							<label
								htmlFor="warna"
								className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
								Warna <span className="text-red-500">*</span>
							</label>
							<div className="mt-1 flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-3">
								{/* native color input */}
								<input
									type="color"
									id="warna_color"
									value={warna || "#000000"}
									onChange={(e) =>
										setValue("warna", e.target.value, { shouldValidate: false, shouldDirty: true })
									}
									required
									className="w-12 h-10 p-0 rounded-md border border-gray-200 cursor-pointer"
									aria-label="Pilih warna"
								/>
								{/* hex input so user can type exact code */}
								<input
									type="text"
									id="warna"
									placeholder="#10B981"
									{...register("warna", {
										required: "Warna wajib diisi",
										pattern: {
											value: /^#?[0-9A-Fa-f]{6}$/,
											message: "Format hex tidak valid",
										},
									})}
									className="flex-1 min-w-[120px] rounded-md border border-gray-200 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
								/>
								{/* live swatch */}
								<div
									className="w-10 h-10 rounded-md border"
									style={{ backgroundColor: warna || "transparent" }}
									aria-hidden
								/>
							</div>
						</div>
					</div>
					<div>
						<label
							htmlFor="deskripsi"
							className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
							Deskripsi Singkat
						</label>
						<textarea
							id="deskripsi"
							placeholder="Contoh: Aksi Peduli Lingkungan"
							{...register("deskripsi", { required: "Deskripsi wajib diisi" })}
							className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
						/>
					</div>

					{/* Icon picker (lucide-react) */}
					<div>
						<label
							htmlFor="icon"
							className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
							Icon Kategori
						</label>
						{/* quick picks */}
						<div className="flex flex-wrap gap-2 mb-3">
							{Object.entries({ Activity, Heart, Leaf, Users, BookOpen, Stethoscope }).map(
								([key, IconComp]) => {
									const selected = iconValue === key;
									return (
										<button
											type="button"
											key={key}
											onClick={() =>
												setValue("icon", key, { shouldValidate: false, shouldDirty: true })
											}
											className={`flex items-center gap-2 px-2 sm:px-3 py-2 border rounded-md text-xs sm:text-sm ${
												selected ? "border-indigo-600 bg-indigo-50" : "border-gray-200 bg-white"
											}`}>
											<IconComp size={16} />
											<span className="capitalize">{key}</span>
										</button>
									);
								}
							)}
						</div>

						{/* free-text Lucide icon name */}
						<div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center mb-2">
							<input
								id="icon"
								type="text"
								placeholder="Ketik nama icon Lucide, mis. Camera"
								{...register("icon")}
								className="flex-1 rounded-md border border-gray-200 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
							/>
							<button
								type="button"
								onClick={() => setValue("icon", "", { shouldValidate: false, shouldDirty: true })}
								className="w-full sm:w-auto px-3 py-2 bg-gray-100 rounded-md text-xs sm:text-sm">
								Clear
							</button>
						</div>

						<div className="mt-2 text-xs sm:text-sm text-gray-500">
							Pilih icon dari pilihan cepat atau ketik nama icon Lucide. Sistem akan menyimpan nama
							komponen (case-sensitive), mis. <code>Leaf</code>.<p></p>
							<p>
								<a
									href="https://lucide.dev/icons/"
									target="_blank"
									rel="noreferrer"
									className="text-blue-600 underline ml-1">
									Dokumentasi Lucide Icon:
								</a>
								<span className="ml-2 font-semibold text-black">
									Klik Icon Lalu pilih tombol "Copy Component Name"
								</span>
							</p>
						</div>

						{iconValue && (
							<div className="mt-3 flex items-center gap-3">
								<span className="text-xs sm:text-sm font-medium">Preview:</span>
								{(() => {
									const categoriesIcons = { Activity, Heart, Leaf, Users, BookOpen, Stethoscope };
									const Comp = categoriesIcons[iconValue];
									return Comp ? (
										<Comp size={24} />
									) : (
										<span className="text-xs sm:text-sm text-gray-500">
											Nama icon tidak ditemukan
										</span>
									);
								})()}
							</div>
						)}
					</div>

					<div className="mb-4">
						<label
							htmlFor="is_active"
							className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
							Status Kategori <span className="text-red-500">*</span>
						</label>
						<select
							id="is_active"
							{...register("is_active", { required: "Status kategori wajib dipilih" })}
							className="mt-1 block w-full sm:w-1/4 rounded-md border border-gray-200 px-3 py-2 text-sm shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
							<option value="">Status Kategori</option>
							<option value="1">Aktif</option>
							<option value="0">Tidak Aktif</option>
						</select>
					</div>

					<div className="mt-auto pt-6">
						<div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3">
							<Button
								type="button"
								variant="outline"
								disabled={isLoading}
								onClick={() => navigate("/admin/categories")}
								className="w-full sm:w-auto order-2 sm:order-1">
								Batal
							</Button>
							<Button
								type="submit"
								variant="success"
								disabled={isLoading || isSubmitting || !isValid}
								loading={isLoading || isSubmitting}
								className="w-full sm:w-auto order-1 sm:order-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-500">
								{isLoading || isSubmitting ? "Menyimpan..." : "Simpan Kategori"}
							</Button>
						</div>
					</div>
				</form>
			</div>
		</div>
	);
}
