import {
	useAdminCategoryById,
	useAdminUpdateCategoryMutation,
} from "@/_hooks/useCategories";
import DynamicButton from "@/components/ui/Button";
import { parseApiError } from "@/utils";
import {
	Loader2,
	Activity,
	Heart,
	Leaf,
	Users,
	BookOpen,
	Stethoscope,
} from "lucide-react";
import * as Lucide from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import Skeleton from "@/components/ui/Skeleton";
import Button from "@/components/ui/Button";
import { useAuthStore } from "@/_hooks/useAuth";

export default function AdminCategoryEdit() {
	const { id } = useParams();
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		nama: "",
		deskripsi: "",
		icon: "",
		warna: "",
		is_active: "1",
	});
	const { isLoading } = useAuthStore();

	const updateCategoryMutation = useAdminUpdateCategoryMutation();

	const { data: showCategory, isLoading: showCategoryLoading } =
		useAdminCategoryById(id);

	useEffect(() => {
		if (!showCategory) return;

		// hanya isi dengan data dari backend jika form lokal belum berisi nama (tidak menimpa edit user)
		setFormData((prev) => {
			if (prev.nama) return prev; // sudah diisi user, jangan timpa
			return {
				nama: showCategory.nama,
				deskripsi: showCategory.deskripsi,
				icon: showCategory.icon,
				warna: showCategory.warna,
				/// normalisasi ke string agar cocok dengan <option value="1"> / "0"
				is_active: showCategory.is_active === true ? "1" : "0",
			};
		});
	}, [showCategory]);
	// Generic change handler
	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((s) => ({ ...s, [name]: value }));
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		const payload = new FormData();
		payload.append("_method", "PUT");

		for (const key in formData) {
			payload.append(key, formData[key]);
		}

		updateCategoryMutation.mutateAsync({ id, data: payload });
	};

	if (showCategoryLoading) return <Skeleton.FormSkeleton title="Loading..." />;

	return (
		<div className="w-full mx-auto p-4 sm:p-6 max-w-6xl min-h-[calc(100vh-4rem)]">
			<div className="bg-white shadow-xl rounded-lg p-4 sm:p-6">
				<header className="mb-6 sm:mb-8">
					<h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
						Edit Kategori
					</h1>
					<p className="text-xs sm:text-sm text-gray-500 mt-1">
						Isi detail kategori.
					</p>
				</header>

				<form onSubmit={handleSubmit} className="space-y-6 flex flex-col">
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
						<div>
							<label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
								Nama Kategori <span className="text-red-500">*</span>
							</label>
							<input
								name="nama"
								value={formData.nama}
								onChange={handleChange}
								type="text"
								required
								placeholder="Contoh:Pendidikan"
								className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
							/>
						</div>
						<div>
							<label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
								Warna <span className="text-red-500">*</span>
							</label>
							<div className="mt-1 flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-3">
								{/* native color input */}
								<input
									type="color"
									name="warna"
									value={formData.warna || "#000000"}
									onChange={handleChange}
									required
									className="w-12 h-10 p-0 rounded-md border border-gray-200 cursor-pointer"
									aria-label="Pilih warna"
								/>
								{/* hex input so user can type exact code */}
								<input
									type="text"
									name="warna"
									value={formData.warna}
									onChange={handleChange}
									placeholder="#10B981"
									className="flex-1 min-w-[120px] rounded-md border border-gray-200 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
								/>
								{/* live swatch */}
								<div
									className="w-10 h-10 rounded-md border"
									style={{ backgroundColor: formData.warna || "transparent" }}
									aria-hidden
								/>
							</div>
						</div>
					</div>
					<div>
						<label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
							Deskripsi Singkat
						</label>
						<textarea
							name="deskripsi"
							value={formData.deskripsi}
							onChange={handleChange}
							required
							placeholder="Contoh: Aksi Peduli Lingkungan"
							className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
						/>
					</div>

					{/* Icon picker (lucide-react) */}
					<div>
						<label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
							Icon Kategori <span className="text-red-500">*</span>
						</label>
						{/* quick picks */}
						<div className="flex flex-wrap gap-2 mb-3">
							{Object.entries({
								Activity,
								Heart,
								Leaf,
								Users,
								BookOpen,
								Stethoscope,
							}).map(([key, IconComp]) => {
								const selected = formData.icon === key;
								return (
									<button
										type="button"
										key={key}
										onClick={() => setFormData((s) => ({ ...s, icon: key }))}
										className={`flex items-center gap-2 px-2 sm:px-3 py-2 border rounded-md text-xs sm:text-sm ${
											selected
												? "border-indigo-600 bg-indigo-50"
												: "border-gray-200 bg-white"
										}`}>
										<IconComp size={16} />
										<span className="capitalize">{key}</span>
									</button>
								);
							})}
						</div>

						{/* free-text Lucide icon name */}
						<div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center mb-2">
							<input
								type="text"
								name="icon"
								value={formData.icon}
								onChange={(e) =>
									setFormData((s) => ({ ...s, icon: e.target.value }))
								}
								placeholder="Ketik nama icon Lucide, mis. Camera"
								className="flex-1 rounded-md border border-gray-200 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
							/>
							<button
								type="button"
								onClick={() => setFormData((s) => ({ ...s, icon: "" }))}
								className="w-full sm:w-auto px-3 py-2 bg-gray-100 rounded-md text-xs sm:text-sm">
								Clear
							</button>
						</div>

						<div className="mt-2 text-xs sm:text-sm text-gray-500">
							Pilih icon dari pilihan cepat atau ketik nama icon Lucide. Sistem
							akan menyimpan nama komponen (case-sensitive), mis.{" "}
							<code>Leaf</code>.<p></p>
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

						{formData.icon && (
							<div className="mt-3 flex items-center gap-3">
								<span className="text-xs sm:text-sm font-medium">Preview:</span>
								{(() => {
									const Comp = Lucide[formData.icon];
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
							htmlFor="category_id"
							className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
							Status Kategori <span className="text-red-500">*</span>
						</label>
						<select
							id="is_active"
							name="is_active"
							value={formData.is_active}
							onChange={handleChange}
							required
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
								disabled={isLoading}
								loading={isLoading}
								className="w-full sm:w-auto order-1 sm:order-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-500">
								{isLoading ? "Menyimpan..." : "Simpan Kategori"}
							</Button>
						</div>
					</div>
				</form>
			</div>
		</div>
	);
}
