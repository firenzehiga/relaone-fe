import { useAdminCreateLocationMutation } from "@/_hooks/useLocations";
import DynamicButton from "@/components/ui/Button";
import { parseApiError } from "@/utils";
import {
	Loader2,
	Activity,
	Heart,
	Leaf,
	Users,
	MapPin,
	BookOpen,
	Zap,
} from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function AdminCategoryCreate() {
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		nama: "",
		deskripsi: "",
		icon: "",
		warna: "",
		is_active: "",
	});
	const [submitting, setSubmitting] = useState(false);

	const createLocationMutation = useAdminCreateLocationMutation();
	// Generic change handler
	const handleChange = (e) => {
		const { name, value } = e.target;
		// keep numeric zoom as number
		setFormData((s) => ({ ...s, [name]: value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setParseError("");
		setSubmitting(true);
		try {
			const payload = new FormData();
			for (const key in formData) {
				payload.append(key, formData[key]);
			}

			await createLocationMutation.mutateAsync(payload);

			toast.success("Location berhasil dibuat", { position: "top-center" });
			navigate("/admin/locations");
		} catch (err) {
			const message = parseApiError(err);
			toast.error(message, { position: "top-center" });
			console.error(err);
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<div className="max-w-6xl mx-auto p-6">
			<div
				className="bg-white shadow-lg rounded-lg p-6"
				style={{ minHeight: 520, width: 900 }}>
				<header className="mb-6">
					<h1 className="text-2xl font-semibold text-gray-900">
						Buat Kategori Baru
					</h1>
					<p className="text-sm text-gray-500 mt-1">Isi detail kategori.</p>
				</header>

				<form onSubmit={handleSubmit} className="space-y-6">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div>
							<label className="block text-sm font-medium text-gray-700">
								Nama Kategori
							</label>
							<input
								name="nama"
								value={formData.nama}
								onChange={handleChange}
								type="text"
								required
								placeholder="Contoh: Lapangan RW 05"
								className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700">
								Warna
							</label>
							<div className="mt-1 flex items-center gap-3">
								{/* native color input */}
								<input
									type="color"
									name="warna"
									value={formData.warna || "#000000"}
									onChange={handleChange}
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
									className="flex-1 rounded-md border border-gray-200 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
						<label className="block text-sm font-medium text-gray-700">
							Deskripsi
						</label>
						<textarea
							name="deskripsi"
							value={formData.deskripsi}
							onChange={handleChange}
							required
							placeholder="Contoh: Lapangan RW 05"
							className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
						/>
					</div>

					{/* Icon picker (lucide-react) */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Icon Kategori
						</label>
						<div className="flex flex-wrap gap-2">
							{Object.entries({
								Activity,
								Heart,
								Leaf,
								Users,
								MapPin,
								BookOpen,
								Zap,
							}).map(([key, IconComp]) => {
								const selected = formData.icon === key;
								return (
									<button
										type="button"
										key={key}
										onClick={() => setFormData((s) => ({ ...s, icon: key }))}
										className={`flex items-center gap-2 px-3 py-2 border rounded-md text-sm ${
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
						<div className="mt-2 text-sm text-gray-500">
							Pilih icon yang paling cocok untuk kategori. Nama icon akan
							disimpan sebagai string (mis. <code>Leaf</code>).
						</div>
						{formData.icon && (
							<div className="mt-3 flex items-center gap-3">
								<span className="text-sm font-medium">Preview:</span>
								{(() => {
									const Comp = {
										Activity,
										Heart,
										Leaf,
										Users,
										MapPin,
										BookOpen,
										Zap,
									}[formData.icon];
									return Comp ? <Comp size={24} /> : null;
								})()}
							</div>
						)}
					</div>

					{/* is_active radio buttons */}
					<div>
						<span className="block text-sm font-medium text-gray-700 mb-2">
							Status Kategori
						</span>
						<div className="flex items-center gap-6">
							<label className="inline-flex items-center gap-2">
								<input
									type="radio"
									name="is_active"
									value="true"
									checked={formData.is_active === "true"}
									onChange={handleChange}
									className="form-radio h-4 w-4 text-indigo-600"
								/>
								<span className="text-sm text-gray-700">Aktif</span>
							</label>
							<label className="inline-flex items-center gap-2">
								<input
									type="radio"
									name="is_active"
									value="false"
									checked={formData.is_active === "false"}
									onChange={handleChange}
									className="form-radio h-4 w-4 text-indigo-600"
								/>
								<span className="text-sm text-gray-700">Tidak Aktif</span>
							</label>
						</div>
					</div>

					<div className="flex items-center justify-end gap-3">
						<DynamicButton
							type="button"
							variant="secondary"
							onClick={() => navigate("/admin/categories")}>
							Batal
						</DynamicButton>
						<button
							type="submit"
							disabled={submitting}
							className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-500">
							{submitting ? (
								<>
									<Loader2 className="animate-spin h-4 w-4 mr-1 mb-1 inline" />
									Menyimpan data....
								</>
							) : (
								"Simpan Lokasi"
							)}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
