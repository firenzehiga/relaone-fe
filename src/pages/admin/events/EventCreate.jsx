import React, { useEffect, useRef, useState } from "react";
import { parseApiError } from "@/utils";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import Button from "@/components/ui/Button";
import { useAdminLocations } from "@/_hooks/useLocations";
import { useAdminOrganizations } from "@/_hooks/useOrganizations";
import { useAuthStore } from "@/_hooks/useAuth";
import { useAdminCreateEventMutation } from "@/_hooks/useEvents";
import { Loader2 } from "lucide-react";
import { useAdminCategory } from "@/_hooks/useCategories";
import Skeleton from "@/components/ui/Skeleton";
export default function AdminEventCreate() {
	const navigate = useNavigate();
	const { user } = useAuthStore();
	const [formData, setFormData] = useState({
		judul: "",
		deskripsi: "",
		deskripsi_singkat: "",
		tanggal_mulai: "",
		tanggal_selesai: "",
		waktu_mulai: "",
		waktu_selesai: "",
		maks_peserta: "",
		gambar: null,
		status: "draft",
		persyaratan: [],
		manfaat: [],
		nama_kontak: "",
		telepon_kontak: "",
		email_kontak: "",
		batas_pendaftaran: "",
		category_id: "",
		organization_id: "",
		location_id: "",
		user_id: user.id,
	});

	const { isLoading } = useAuthStore();
	const [persyaratanInput, setPersyaratanInput] = useState("");
	const [manfaatInput, setManfaatInput] = useState("");

	const [error, setError] = useState("");
	const fileInputRef = useRef(null);
	const [previewUrl, setPreviewUrl] = useState("");

	const createEventMutation = useAdminCreateEventMutation();
	const {
		data: locations = [],
		isLoading: locationsLoading,
		error: locationsError,
	} = useAdminLocations();

	const {
		data: organizations = [],
		isLoading: organizationsLoading,
		error: organizationsError,
	} = useAdminOrganizations();

	const {
		data: categories = [],
		isLoading: categoriesLoading,
		error: categoriesError,
	} = useAdminCategory();

	const handleChange = (e) => {
		const { name, value, files } = e.target;
		// file input validation
		if (name === "gambar") {
			const file = files && files[0];
			if (!file) return;

			// allowed mime types and max size (2MB)
			const allowed = ["image/jpeg", "image/png", "image/jpg"];
			const maxSize = 2 * 1024 * 1024; // 2MB

			if (!allowed.includes(file.type)) {
				toast.error(
					"File harus berupa gambar JPEG/PNG/JPG (webp tidak diperbolehkan).",
					{ position: "top-center" }
				);
				return;
			}
			if (file.size > maxSize) {
				toast.error("Ukuran file maksimal 2MB.", {
					position: "top-center",
				});
				return;
			}

			setError("");
			setFormData((s) => ({ ...s, [name]: file }));
		} else {
			setFormData((s) => ({ ...s, [name]: value }));
		}
	};

	// buat preview gambar saat file diubah
	useEffect(() => {
		let url;
		if (formData.gambar instanceof File) {
			url = URL.createObjectURL(formData.gambar);
			setPreviewUrl(url);
		} else setPreviewUrl("");
		return () => {
			if (url) URL.revokeObjectURL(url);
		};
	}, [formData.gambar]);

	// persyaratan handlers (array)
	const addPersyaratan = () => {
		const v = persyaratanInput && persyaratanInput.trim();
		if (!v) return;
		setFormData((s) => ({ ...s, persyaratan: [...s.persyaratan, v] }));
		setPersyaratanInput("");
	};
	const updatePersyaratan = (idx, value) => {
		setFormData((s) => ({
			...s,
			persyaratan: s.persyaratan.map((p, i) => (i === idx ? value : p)),
		}));
	};
	const removePersyaratan = (idx) => {
		setFormData((s) => ({
			...s,
			persyaratan: s.persyaratan.filter((_, i) => i !== idx),
		}));
	};

	// manfaat handlers (array)
	const addManfaat = () => {
		const v = manfaatInput && manfaatInput.trim();
		if (!v) return;
		setFormData((s) => ({ ...s, manfaat: [...s.manfaat, v] }));
		setManfaatInput("");
	};
	const updateManfaat = (idx, value) => {
		setFormData((s) => ({
			...s,
			manfaat: s.manfaat.map((m, i) => (i === idx ? value : m)),
		}));
	};
	const removeManfaat = (idx) => {
		setFormData((s) => ({
			...s,
			manfaat: s.manfaat.filter((_, i) => i !== idx),
		}));
	};

	const handleDrop = (e) => {
		e.preventDefault();
		e.stopPropagation();
		const dt = e.dataTransfer;
		if (!dt?.files?.length) return;
		const file = dt.files[0];

		const allowed = ["image/jpeg", "image/png", "image/jpg"];
		const maxSize = 2 * 1024 * 1024;
		if (!allowed.includes(file.type)) {
			toast.error("File harus berupa gambar JPEG/PNG/JPG.", {
				position: "top-center",
			});
			return;
		}
		if (file.size > maxSize) {
			toast.error("Ukuran file maksimal 2MB.", { position: "top-center" });
			return;
		}

		setError("");
		setFormData((s) => ({ ...s, gambar: file }));
	};

	const handleDragOver = (e) => {
		e.preventDefault();
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		setError("");

		const payload = new FormData();
		for (const key in formData) {
			if (Array.isArray(formData[key])) {
				payload.append(key, JSON.stringify(formData[key])); // Kondisi khusus untuk persyaratan dan manfaat agar backend dapat menguraikannya kembali ke array
			} else {
				payload.append(key, formData[key] ?? "");
			}
		}

		createEventMutation.mutateAsync(payload);
	};

	if (locationsLoading || organizationsLoading || categoriesLoading) {
		return <Skeleton.FormSkeleton title="Loading..." />;
	}

	if (locationsError || organizationsError || categoriesError) {
		return (
			<div>
				{locationsError?.message ||
					organizationsError?.message ||
					categoriesError?.message}
			</div>
		);
	}

	return (
		<div className="max-w-7xl mx-auto p-6">
			<div className="bg-white shadow-xl rounded-lg p-6">
				<header className="mb-8">
					<h1 className="text-2xl font-semibold text-gray-900 mb-2">
						Buat Event Baru
					</h1>
					<p className="text-sm text-gray-500 mt-1">
						Isi nama, deskripsi dan tambahkan gambar untuk event.
					</p>
				</header>

				<form onSubmit={handleSubmit} className="space-y-6">
					{error && (
						<div className="text-sm text-red-600 bg-red-50 p-2 rounded">
							{error}
						</div>
					)}

					<Tabs variant="enclosed" colorScheme="green" isFitted>
						<TabList>
							<Tab className="font-semibold">Informasi Event</Tab>
							<Tab className="font-semibold">Jadwal Kegiatan</Tab>
							<Tab className="font-semibold">Penanggung Jawab</Tab>
						</TabList>

						<TabPanels className="mt-6" style={{ minHeight: 420, width: 900 }}>
							<TabPanel>
								{/* Judul & Deskripsi */}
								<div className="mb-4">
									<label
										htmlFor="judul"
										className="block text-sm font-medium text-gray-700">
										Nama Event <span className="text-red-500">*</span>
									</label>
									<input
										id="judul"
										name="judul"
										value={formData.judul}
										onChange={handleChange}
										type="text"
										required
										placeholder="Contoh: Bersih Pantai"
										className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
									/>
								</div>

								<div className="mb-4">
									<label
										htmlFor="deskripsi"
										className="block text-sm font-medium text-gray-700">
										Deskripsi <span className="text-red-500">*</span>
									</label>
									<textarea
										id="deskripsi"
										name="deskripsi"
										value={formData.deskripsi}
										onChange={handleChange}
										required
										rows={4}
										placeholder="Tulis deskripsi lengkap mengenai event ini..."
										className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
									/>
								</div>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div className="mb-4">
										<label
											htmlFor="deskripsi_singkat"
											className="block text-sm font-medium text-gray-700">
											Deskripsi Singkat
										</label>
										<input
											id="deskripsi_singkat"
											name="deskripsi_singkat"
											value={formData.deskripsi_singkat}
											onChange={handleChange}
											type="text"
											required
											placeholder="Contoh: Bersih Pantai"
											className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
										/>
									</div>
									<div className="mb-4">
										<label
											htmlFor="category_id"
											className="block text-sm font-medium text-gray-700">
											Kategori Kegiatan <span className="text-red-500">*</span>
										</label>
										<select
											id="category_id"
											name="category_id"
											value={formData.category_id}
											onChange={handleChange}
											required
											className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
											<option value="">Pilih Kategori</option>
											{categories.map((category) => (
												<option key={category.id} value={category.id}>
													{category.nama}
												</option>
											))}
										</select>
									</div>
								</div>
								<div className="mb-4">
									<label className="block text-sm font-medium text-gray-700">
										Gambar Event <span className="text-red-500">*</span>
									</label>
									<div
										onDrop={handleDrop}
										onDragOver={handleDragOver}
										className="mt-2 flex items-center gap-4">
										<div className="flex-1">
											<p className="text-sm text-gray-500">
												PNG / JPG — maksimal 2MB. (webp tidak diperbolehkan)
											</p>
											<div className="mt-3 flex gap-3">
												<label className="inline-flex items-center px-3 py-2 bg-white border rounded-md text-sm text-gray-700 hover:bg-gray-50 cursor-pointer">
													Pilih Gambar
													<input
														ref={fileInputRef}
														name="gambar"
														id="gambar"
														type="file"
														accept="image/*"
														required
														onChange={handleChange}
														className="sr-only"
													/>
												</label>
											</div>
											{formData.gambar && (
												<div className="ml-4 flex flex-col items-center">
													{previewUrl ? (
														<img
															src={previewUrl}
															alt={formData.gambar.name}
															className="w-60 h-40 object-cover rounded border"
														/>
													) : (
														<div className="w-40 h-28 bg-gray-100 rounded flex items-center justify-center border text-xs text-gray-500">
															Preview...
														</div>
													)}
													<div className="mt-2 text-sm text-gray-700 truncate w-70 text-center">
														{formData.gambar.name}
													</div>
												</div>
											)}
											<p className="mt-2 text-xs text-gray-400">
												Kamu juga bisa seret & lepas gambar ke area ini.
											</p>
										</div>
									</div>
								</div>
							</TabPanel>
							<TabPanel>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									<div className="mb-4">
										<label
											htmlFor="tanggal_mulai"
											className="block text-sm font-medium text-gray-700">
											Tanggal Mulai <span className="text-red-500">*</span>
										</label>
										<input
											id="tanggal_mulai"
											name="tanggal_mulai"
											type="date"
											value={formData.tanggal_mulai}
											onChange={handleChange}
											required
											className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
										/>
									</div>
									<div>
										<label
											htmlFor="tanggal_selesai"
											className="block text-sm font-medium text-gray-700">
											Tanggal Selesai <span className="text-red-500">*</span>
										</label>
										<input
											id="tanggal_selesai"
											name="tanggal_selesai"
											type="date"
											value={formData.tanggal_selesai}
											onChange={handleChange}
											required
											className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
										/>
									</div>
								</div>

								{/* Waktu & Kapasitas */}
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									<div className="mb-4">
										<label
											htmlFor="waktu_mulai"
											className="block text-sm font-medium text-gray-700">
											Waktu Mulai <span className="text-red-500">*</span>
										</label>
										<input
											id="waktu_mulai"
											name="waktu_mulai"
											type="time"
											value={formData.waktu_mulai}
											onChange={handleChange}
											required
											className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
										/>
									</div>
									<div>
										<label
											htmlFor="waktu_selesai"
											className="block text-sm font-medium text-gray-700">
											Waktu Selesai <span className="text-red-500">*</span>
										</label>
										<input
											id="waktu_selesai"
											name="waktu_selesai"
											type="time"
											value={formData.waktu_selesai}
											onChange={handleChange}
											required
											className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
										/>
									</div>
								</div>

								<div className="grid grid-cols-1 gap-4 md:grid-cols-4">
									<div className="mb-4">
										<label
											htmlFor="batas_pendaftaran"
											className="block text-sm font-medium text-gray-700">
											Batas Pendaftaran <span className="text-red-500">*</span>
										</label>
										<input
											id="batas_pendaftaran"
											name="batas_pendaftaran"
											type="date"
											value={formData.batas_pendaftaran}
											onChange={handleChange}
											required
											className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
										/>
									</div>
									<div>
										<label
											htmlFor="maks_peserta"
											className="block text-sm font-medium text-gray-700">
											Maks Peserta <span className="text-red-500">*</span>
										</label>
										<input
											id="maks_peserta"
											name="maks_peserta"
											type="number"
											min="0"
											value={formData.maks_peserta}
											onChange={handleChange}
											required
											placeholder="Misal: 50"
											className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
										/>
									</div>
									<div>
										<label
											htmlFor="location_id"
											className="block text-sm font-medium text-gray-700">
											Lokasi <span className="text-red-500">*</span>
										</label>
										<select
											id="location_id"
											name="location_id"
											value={formData.location_id}
											onChange={handleChange}
											required
											className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
											<option value="">Pilih Lokasi</option>
											{locations.map((location) => (
												<option key={location.id} value={location.id}>
													{location.nama}
												</option>
											))}
										</select>
									</div>
									<div>
										<label
											htmlFor="organization_id"
											className="block text-sm font-medium text-gray-700">
											Organisasi <span className="text-red-500">*</span>
										</label>
										<select
											id="organization_id"
											name="organization_id"
											value={formData.organization_id}
											onChange={handleChange}
											required
											className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
											<option value="">Pilih Organisasi</option>
											{organizations.map((organization) => (
												<option key={organization.id} value={organization.id}>
													{organization.nama}
												</option>
											))}
										</select>
									</div>
								</div>

								{/* Persyaratan & Manfaat (list inputs) */}
								<div className="grid grid-cols-1 gap-6 md:grid-cols-2 mt-4">
									<div>
										<label className="block text-sm font-medium text-gray-700">
											Persyaratan
										</label>
										<div className="mt-2 space-y-2">
											{formData.persyaratan &&
											formData.persyaratan.length > 0 ? (
												formData.persyaratan.map((p, idx) => (
													<div key={idx} className="flex items-center gap-2">
														<input
															type="text"
															className="flex-1 rounded-md border border-gray-200 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
															value={p}
															onChange={(e) =>
																updatePersyaratan(idx, e.target.value)
															}
														/>
														<button
															type="button"
															onClick={() => removePersyaratan(idx)}
															className="px-2 py-1 text-sm text-red-600 bg-red-50 rounded">
															Hapus
														</button>
													</div>
												))
											) : (
												<div className="text-sm text-gray-400">
													Belum ada persyaratan. Tambahkan di bawah.
												</div>
											)}

											<div className="flex items-center gap-2">
												<input
													type="text"
													placeholder="Tambahkan persyaratan, misal: Minimal lulusan SMA"
													className="flex-1 rounded-md border border-gray-200 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
													value={persyaratanInput}
													onChange={(e) => setPersyaratanInput(e.target.value)}
													onKeyDown={(e) => {
														if (e.key === "Enter") {
															e.preventDefault();
															addPersyaratan();
														}
													}}
												/>
												<Button
													variant="success"
													type="button"
													onClick={addPersyaratan}>
													Tambah
												</Button>
											</div>
										</div>
									</div>

									<div>
										<label className="block text-sm font-medium text-gray-700">
											Manfaat
										</label>
										<div className="mt-2 space-y-2">
											{formData.manfaat && formData.manfaat.length > 0 ? (
												formData.manfaat.map((m, idx) => (
													<div key={idx} className="flex items-center gap-2">
														<input
															type="text"
															className="flex-1 rounded-md border border-gray-200 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
															value={m}
															onChange={(e) =>
																updateManfaat(idx, e.target.value)
															}
														/>
														<button
															type="button"
															onClick={() => removeManfaat(idx)}
															className="px-2 py-1 text-sm text-red-600 bg-red-50 rounded">
															Hapus
														</button>
													</div>
												))
											) : (
												<div className="text-sm text-gray-400">
													Belum ada manfaat. Tambahkan di bawah.
												</div>
											)}

											<div className="flex items-center gap-2">
												<input
													type="text"
													placeholder="Tambahkan manfaat, misal: Mendapatkan sertifikat"
													className="flex-1 rounded-md border border-gray-200 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
													value={manfaatInput}
													onChange={(e) => setManfaatInput(e.target.value)}
													onKeyDown={(e) => {
														if (e.key === "Enter") {
															e.preventDefault();
															addManfaat();
														}
													}}
												/>
												<Button
													variant="success"
													type="button"
													onClick={addManfaat}>
													Tambah
												</Button>
											</div>
										</div>
									</div>
								</div>
							</TabPanel>
							<TabPanel>
								{/* Kontak */}
								<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
									<div>
										<label
											htmlFor="nama_kontak"
											className="block text-sm font-medium text-gray-700">
											Nama Kontak
										</label>
										<input
											id="nama_kontak"
											name="nama_kontak"
											type="text"
											value={formData.nama_kontak}
											onChange={handleChange}
											required
											className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
										/>
									</div>

									<div>
										<label
											htmlFor="telepon_kontak"
											className="block text-sm font-medium text-gray-700">
											Telepon Kontak
										</label>
										<input
											id="telepon_kontak"
											name="telepon_kontak"
											type="text"
											value={formData.telepon_kontak}
											onChange={handleChange}
											placeholder="08xxxxxxxxxx"
											required
											className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
										/>
									</div>

									<div className="mb-4">
										<label
											htmlFor="email_kontak"
											className="block text-sm font-medium text-gray-700">
											Email Kontak
										</label>
										<input
											id="email_kontak"
											name="email_kontak"
											type="email"
											value={formData.email_kontak}
											onChange={handleChange}
											required
											placeholder="nama@contoh.com"
											className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
										/>
									</div>
								</div>

								<div className="grid grid-cols-1 gap-4 md:grid-cols-3 items-start">
									<div>
										<label
											htmlFor="status"
											className="block text-sm font-medium text-gray-700">
											Status <span className="text-red-500">*</span>
										</label>
										<select
											id="status"
											name="status"
											value={formData.status}
											onChange={handleChange}
											required
											className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
											<option value="draft">Draft</option>
											<option value="published">Published</option>
										</select>
									</div>
								</div>
							</TabPanel>
						</TabPanels>
					</Tabs>
					<>
						<div className="flex items-center justify-end gap-3">
							<Button
								variant="outline"
								type="button"
								onClick={() => {
									navigate("/admin/events");
								}}
								className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md">
								Batal
							</Button>
							<Button
								type="submit"
								variant="success"
								loading={isLoading}
								disabled={isLoading}>
								{isLoading ? "Membuat..." : "Buat Event"}
							</Button>
						</div>
					</>
				</form>
			</div>
		</div>
	);
}
