import React, { useEffect, useRef, useState } from "react";
import { getImageUrl } from "@/utils";
import { toast } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import Button from "@/components/ui/DynamicButton";
import { useAdminLocations } from "@/_hooks/useLocations";
import { useAdminOrganizations } from "@/_hooks/useOrganizations";
import { useAuthStore } from "@/_hooks/useAuth";
import { useAdminUpdateEventMutation, useAdminEventById } from "@/_hooks/useEvents";
import { Image } from "lucide-react";
import { useAdminCategory } from "@/_hooks/useCategories";
import Skeleton from "@/components/ui/Skeleton";
import { toInputTime, toInputDate } from "@/utils/dateFormatter";
import { AsyncImage } from "loadable-image";
import { useForm } from "react-hook-form";
export default function AdminEventEdit() {
	const { id } = useParams();
	const navigate = useNavigate();
	const { user } = useAuthStore();
	const { register, handleSubmit, setValue, watch, reset, getValues, formState } = useForm({
		defaultValues: {
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
			created_by_user_id: user.id,
		},
	});

	const { isLoading } = useAuthStore();
	const [persyaratanInput, setPersyaratanInput] = useState("");
	const [manfaatInput, setManfaatInput] = useState("");

	const [error, setError] = useState("");
	const [imagePreview, setImagePreview] = useState(null);

	const updateEventMutation = useAdminUpdateEventMutation();

	// fetch event detail for editing
	const { data: showEvent, isLoading: showEventLoading } = useAdminEventById(id);
	const { locations, isLoading: locationsLoading, error: locationsError } = useAdminLocations();

	const {
		organizations,
		isLoading: organizationsLoading,
		error: organizationsError,
	} = useAdminOrganizations();

	const { categories, isLoading: categoriesLoading, error: categoriesError } = useAdminCategory();

	// Lokasi yang difilter berdasarkan organisasi yang dipilih di form
	const organization_id = watch("organization_id");
	const filteredLocations = locations.filter((loc) =>
		organization_id ? String(loc.organization_id) === String(organization_id) : false
	);

	// Jika organisasi berubah dan lokasi saat ini tidak cocok, kosongkan lokasi
	useEffect(() => {
		if (!organization_id) return;
		const ok = locations.some(
			(loc) =>
				String(loc.organization_id) === String(organization_id) &&
				String(loc.id) === String(getValues("location_id"))
		);
		if (!ok && getValues("location_id")) {
			setValue("location_id", "", { shouldDirty: true });
		}
	}, [organization_id, locations]);

	const handleChange = (e) => {
		const { name, value, files } = e.target;
		if (name === "gambar") {
			const file = files && files[0];
			if (!file) return;

			const allowed = ["image/jpeg", "image/png", "image/jpg"];
			const maxSize = 2 * 1024 * 1024; // 2MB
			if (!allowed.includes(file.type)) {
				toast.error("File harus berupa gambar JPEG/PNG/JPG (selain itu tidak diperbolehkan).", {
					position: "top-center",
				});
				return;
			}
			if (file.size > maxSize) {
				toast.error("Ukuran file maksimal 2MB.", {
					position: "top-center",
				});
				return;
			}

			setError("");
			setValue("gambar", file, { shouldDirty: true });
		} else {
			setValue(name, value, { shouldDirty: true });
		}
	};
	const parseArray = (v) => {
		if (!v) return [];
		if (Array.isArray(v)) return v;
		if (typeof v === "string") {
			try {
				const p = JSON.parse(v);
				if (Array.isArray(p)) return p;
			} catch (e) {
				// not JSON — fallthrough to comma split
				return v
					.split(",")
					.map((s) => s.trim())
					.filter(Boolean);
			}
			return [v];
		}
		// other types — wrap
		return [String(v)];
	};
	// populate form from showEvent once (don't overwrite user edits)
	useEffect(() => {
		if (!showEvent) return;
		// if user already started typing title, don't overwrite
		if (getValues("judul")) return;
		reset({
			judul: showEvent.judul || "",
			deskripsi: showEvent.deskripsi || "",
			deskripsi_singkat: showEvent.deskripsi_singkat || "",
			tanggal_mulai: toInputDate(showEvent.tanggal_mulai) || "",
			tanggal_selesai: toInputDate(showEvent.tanggal_selesai) || "",
			waktu_mulai: toInputTime(showEvent.waktu_mulai) || "",
			waktu_selesai: toInputTime(showEvent.waktu_selesai) || "",
			maks_peserta: showEvent.maks_peserta || "",
			gambar: showEvent.gambar || null,
			status: showEvent.status || "",
			persyaratan: parseArray(showEvent.persyaratan) || [],
			manfaat: parseArray(showEvent.manfaat) || [],
			nama_kontak: showEvent.nama_kontak || "",
			telepon_kontak: showEvent.telepon_kontak || "",
			email_kontak: showEvent.email_kontak || "",
			batas_pendaftaran: toInputDate(showEvent.batas_pendaftaran) || "",
			category_id: showEvent.category_id || "",
			organization_id: showEvent.organization_id || "",
			location_id: showEvent.location_id || "",
			created_by_user_id: showEvent.created_by_user_id || user.id || "",
		});

		// Set image preview jika ada gambar existing
		if (showEvent.gambar) {
			setImagePreview(getImageUrl(`events/${showEvent.gambar}`));
		}
	}, [showEvent]);

	// buat preview gambar saat file diubah
	const gambar = watch("gambar");
	useEffect(() => {
		let url;
		if (gambar instanceof File) {
			url = URL.createObjectURL(gambar);
			setImagePreview(url);
		}
		return () => {
			if (url) URL.revokeObjectURL(url);
		};
	}, [gambar]);

	// watch array fields for rendering
	const persyaratan = watch("persyaratan") || [];
	const manfaat = watch("manfaat") || [];

	// persyaratan handlers (array)
	const addPersyaratan = () => {
		const v = persyaratanInput && persyaratanInput.trim();
		if (!v) return;
		const current = getValues("persyaratan") || [];
		setValue("persyaratan", [...current, v], { shouldDirty: true });
		setPersyaratanInput("");
	};
	const updatePersyaratan = (idx, value) => {
		const current = getValues("persyaratan") || [];
		setValue(
			"persyaratan",
			current.map((p, i) => (i === idx ? value : p)),
			{ shouldDirty: true }
		);
	};
	const removePersyaratan = (idx) => {
		const current = getValues("persyaratan") || [];
		setValue(
			"persyaratan",
			current.filter((_, i) => i !== idx),
			{ shouldDirty: true }
		);
	};

	// manfaat handlers (array)
	const addManfaat = () => {
		const v = manfaatInput && manfaatInput.trim();
		if (!v) return;
		const current = getValues("manfaat") || [];
		setValue("manfaat", [...current, v], { shouldDirty: true });
		setManfaatInput("");
	};
	const updateManfaat = (idx, value) => {
		const current = getValues("manfaat") || [];
		setValue(
			"manfaat",
			current.map((m, i) => (i === idx ? value : m)),
			{ shouldDirty: true }
		);
	};
	const removeManfaat = (idx) => {
		const current = getValues("manfaat") || [];
		setValue(
			"manfaat",
			current.filter((_, i) => i !== idx),
			{ shouldDirty: true }
		);
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
		setValue("gambar", file, { shouldDirty: true });
	};

	const handleDragOver = (e) => {
		e.preventDefault();
	};

	const onSubmit = (data) => {
		setError("");

		const payload = new FormData();
		payload.append("_method", "PUT");
		for (const key in data) {
			const value = data[key];
			if (key === "gambar") {
				if (value instanceof File) payload.append("gambar", value);
			} else if (Array.isArray(value)) {
				payload.append(key, JSON.stringify(value));
			} else {
				payload.append(key, value ?? "");
			}
		}

		updateEventMutation.mutateAsync({ id, data: payload });
	};

	if (locationsLoading || organizationsLoading || categoriesLoading || showEventLoading) {
		return <Skeleton.FormSkeleton title="Loading..." />;
	}

	if (locationsError || organizationsError || categoriesError) {
		return (
			<div>
				{locationsError?.message || organizationsError?.message || categoriesError?.message}
			</div>
		);
	}

	return (
		<div className="w-full mx-auto p-4 sm:p-6 max-w-7xl min-h-[calc(100vh-4rem)]">
			<div className="bg-white shadow-xl rounded-lg p-4 sm:p-6">
				<header className="mb-6 sm:mb-8">
					<h1 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">Edit Event</h1>
					<p className="text-xs sm:text-sm text-gray-500 mt-1">
						Isi nama, deskripsi dan tambahkan gambar untuk event.
					</p>
				</header>

				<form onSubmit={handleSubmit(onSubmit)} className="space-y-6 flex flex-col">
					{error && <div className="text-sm text-red-600 bg-red-50 p-2 rounded">{error}</div>}

					<Tabs variant="enclosed" colorScheme="green" isFitted>
						<TabList className="flex-wrap">
							<Tab className="font-semibold text-xs sm:text-sm flex-1 min-w-[100px]">
								Informasi Event
							</Tab>
							<Tab className="font-semibold text-xs sm:text-sm flex-1 min-w-[100px]">
								Jadwal Kegiatan
							</Tab>
							<Tab className="font-semibold text-xs sm:text-sm flex-1 min-w-[100px]">
								Penanggung Jawab
							</Tab>
						</TabList>

						<TabPanels className="mt-4 sm:mt-6 w-full" style={{ minHeight: "420px" }}>
							<TabPanel>
								{/* Judul & Deskripsi */}
								<div className="mb-4">
									<label
										htmlFor="judul"
										className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
										Nama Event <span className="text-red-500">*</span>
									</label>
									<input
										id="judul"
										{...register("judul", { required: true })}
										type="text"
										placeholder="Contoh: Bersih Pantai"
										className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
									/>
								</div>

								<div className="mb-4">
									<label
										htmlFor="deskripsi"
										className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
										Deskripsi <span className="text-red-500">*</span>
									</label>
									<textarea
										id="deskripsi"
										{...register("deskripsi", { required: true })}
										rows={4}
										placeholder="Tulis deskripsi lengkap mengenai event ini..."
										className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
									/>
								</div>
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
									<div className="mb-4">
										<label
											htmlFor="deskripsi_singkat"
											className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
											Deskripsi Singkat
										</label>
										<input
											id="deskripsi_singkat"
											{...register("deskripsi_singkat", { required: true })}
											type="text"
											placeholder="Contoh: Bersih Pantai"
											className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
										/>
									</div>
									<div className="mb-4">
										<label
											htmlFor="category_id"
											className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
											Kategori Kegiatan <span className="text-red-500">*</span>
										</label>
										<select
											id="category_id"
											{...register("category_id", { required: true })}
											className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 text-sm shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
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
									<label
										htmlFor="gambar"
										className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
										Gambar Event <span className="text-red-500">*</span>
									</label>
									<div className="mt-2" onDrop={handleDrop} onDragOver={handleDragOver}>
										<div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
											{/* Image Preview */}
											<div className="relative mx-auto sm:mx-0">
												{imagePreview ? (
													<AsyncImage
														src={imagePreview}
														alt="Preview"
														className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg object-cover border-4 border-white shadow-lg"
													/>
												) : (
													<div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg bg-gray-200 flex items-center justify-center border-4 border-white shadow-lg">
														<Image className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400" />
													</div>
												)}
											</div>

											{/* Upload Button and Info */}
											<div className="flex flex-col space-y-2 w-full sm:w-auto">
												<div className="relative">
													<input
														type="file"
														id="gambar"
														name="gambar"
														accept="image/jpeg,image/jpg,image/png"
														onChange={(e) => {
															const file = e.target.files && e.target.files[0];
															if (!file) return;
															const allowed = ["image/jpeg", "image/png", "image/jpg"];
															const maxSize = 2 * 1024 * 1024;
															if (!allowed.includes(file.type)) {
																toast.error(
																	"File harus berupa gambar JPEG/PNG/JPG (selain itu tidak diperbolehkan).",
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
															setValue("gambar", file, { shouldDirty: true });
														}}
														className="hidden"
													/>
													<label
														htmlFor="gambar"
														className="inline-flex items-center justify-center w-full sm:w-auto px-4 py-2 bg-blue-50 text-blue-600 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors duration-200 text-xs sm:text-sm font-medium">
														<Image className="w-4 h-4 mr-2" />
														{imagePreview ? "Ganti Gambar" : "Upload Gambar"}
													</label>
												</div>

												<p className="text-xs text-gray-500 text-center sm:text-left">
													Format: JPEG, JPG, PNG. Maksimal 2MB.
												</p>

												{gambar && (
													<p className="text-xs text-gray-700 break-all text-center sm:text-left">
														{gambar instanceof File ? gambar.name : "Gambar event saat ini"}
													</p>
												)}
											</div>
										</div>

										<p className="mt-3 text-xs text-gray-400 text-center sm:text-left hidden sm:block">
											Kamu juga bisa seret & lepas gambar ke area ini.
										</p>
									</div>
								</div>
							</TabPanel>
							<TabPanel>
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
									<div className="mb-4">
										<label
											htmlFor="tanggal_mulai"
											className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
											Tanggal Mulai <span className="text-red-500">*</span>
										</label>
										<input
											id="tanggal_mulai"
											{...register("tanggal_mulai", { required: true })}
											type="date"
											className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 text-sm shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
										/>
									</div>
									<div className="mb-4">
										<label
											htmlFor="tanggal_selesai"
											className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
											Tanggal Selesai <span className="text-red-500">*</span>
										</label>
										<input
											id="tanggal_selesai"
											{...register("tanggal_selesai", { required: true })}
											type="date"
											className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 text-sm shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
										/>
									</div>
								</div>

								{/* Waktu & Kapasitas */}
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
									<div className="mb-4">
										<label
											htmlFor="waktu_mulai"
											className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
											Waktu Mulai <span className="text-red-500">*</span>
										</label>
										<input
											id="waktu_mulai"
											{...register("waktu_mulai", { required: true })}
											type="time"
											className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 text-sm shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
										/>
									</div>
									<div className="mb-4">
										<label
											htmlFor="waktu_selesai"
											className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
											Waktu Selesai <span className="text-red-500">*</span>
										</label>
										<input
											id="waktu_selesai"
											{...register("waktu_selesai", { required: true })}
											type="time"
											className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 text-sm shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
										/>
									</div>
								</div>

								<div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
									<div className="mb-4">
										<label
											htmlFor="batas_pendaftaran"
											className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
											Batas Pendaftaran <span className="text-red-500">*</span>
										</label>
										<input
											id="batas_pendaftaran"
											{...register("batas_pendaftaran", { required: true })}
											type="date"
											className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 text-sm shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
										/>
									</div>

									<div className="mb-4">
										<label
											htmlFor="maks_peserta"
											className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
											Maks Peserta <span className="text-red-500">*</span>
										</label>
										<input
											id="maks_peserta"
											{...register("maks_peserta")}
											type="number"
											min="0"
											required
											placeholder="Misal: 50"
											className="mt-1 block w-full  rounded-md border border-gray-200 px-3 py-2 text-sm shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
										/>
									</div>

									<div className="mb-4">
										<label
											htmlFor="location_id"
											className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
											Lokasi <span className="text-red-500">*</span>
										</label>
										<select
											id="location_id"
											{...register("location_id", { required: true })}
											className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 text-sm shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
											<option value="">Pilih Lokasi</option>
											{filteredLocations.map((location) => (
												<option key={location.id} value={location.id}>
													{location.nama}
												</option>
											))}
										</select>
									</div>
								</div>

								{/* Persyaratan & Manfaat (list inputs) */}
								<div className="grid grid-cols-1 gap-6 sm:gap-6 mt-4">
									<div>
										<label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
											Persyaratan
										</label>
										<div className="mt-2 space-y-2">
											{persyaratan && persyaratan.length > 0 ? (
												persyaratan.map((p, idx) => (
													<div
														key={idx}
														className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
														<input
															type="text"
															className="flex-1 rounded-md border border-gray-200 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
															value={p}
															onChange={(e) => updatePersyaratan(idx, e.target.value)}
														/>
														<button
															type="button"
															onClick={() => removePersyaratan(idx)}
															className="px-3 py-2 text-xs sm:text-sm text-red-600 bg-red-50 rounded hover:bg-red-100 transition-colors">
															Hapus
														</button>
													</div>
												))
											) : (
												<div className="text-xs sm:text-sm text-gray-400">
													Belum ada persyaratan. Tambahkan di bawah.
												</div>
											)}

											<div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
												<label htmlFor="persyaratan-input" className="sr-only">
													Tambahkan persyaratan
												</label>
												<input
													id="persyaratan-input"
													type="text"
													placeholder="Tambahkan persyaratan"
													className="flex-1 rounded-md border border-gray-200 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
													size="sm"
													onClick={addPersyaratan}
													className="w-full sm:w-auto">
													Tambah
												</Button>
											</div>
										</div>
									</div>

									<div>
										<label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
											Manfaat
										</label>
										<div className="mt-2 space-y-2">
											{manfaat && manfaat.length > 0 ? (
												manfaat.map((m, idx) => (
													<div
														key={idx}
														className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
														<input
															type="text"
															className="flex-1 rounded-md border border-gray-200 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
															value={m}
															onChange={(e) => updateManfaat(idx, e.target.value)}
														/>
														<button
															type="button"
															onClick={() => removeManfaat(idx)}
															className="px-3 py-2 text-xs sm:text-sm text-red-600 bg-red-50 rounded hover:bg-red-100 transition-colors">
															Hapus
														</button>
													</div>
												))
											) : (
												<div className="text-xs sm:text-sm text-gray-400">
													Belum ada manfaat. Tambahkan di bawah.
												</div>
											)}

											<div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
												<label htmlFor="manfaat-input" className="sr-only">
													Tambahkan manfaat
												</label>
												<input
													id="manfaat-input"
													type="text"
													placeholder="Tambahkan manfaat"
													className="flex-1 rounded-md border border-gray-200 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
													size="sm"
													onClick={addManfaat}
													className="w-full sm:w-auto">
													Tambah
												</Button>
											</div>
										</div>
									</div>
								</div>
							</TabPanel>
							<TabPanel>
								{/* Kontak */}
								<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
									<div className="mb-4">
										<label
											htmlFor="nama_kontak"
											className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
											Nama Kontak
										</label>
										<input
											id="nama_kontak"
											{...register("nama_kontak")}
											type="text"
											required
											className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
										/>
									</div>

									<div className="mb-4">
										<label
											htmlFor="telepon_kontak"
											className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
											Telepon Kontak
										</label>
										<input
											id="telepon_kontak"
											{...register("telepon_kontak")}
											type="text"
											placeholder="08xxxxxxxxxx"
											required
											className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
										/>
									</div>
								</div>
								<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
									<div className="mb-4">
										<label
											htmlFor="email_kontak"
											className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
											Email Kontak
										</label>
										<input
											id="email_kontak"
											{...register("email_kontak")}
											type="email"
											required
											placeholder="nama@contoh.com"
											className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
										/>
									</div>
									<div className="mb-4">
										<label
											htmlFor="organization_id"
											className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
											Organisasi <span className="text-red-500">*</span>
										</label>
										<select
											id="organization_id"
											{...register("organization_id", { required: true })}
											className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 text-sm shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
											<option value="">Pilih Organisasi</option>
											{organizations.map((organization) => (
												<option key={organization.id} value={organization.id}>
													{organization.nama}
												</option>
											))}
										</select>
									</div>
								</div>

								<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 items-start">
									<div className="mb-4">
										<label
											htmlFor="status"
											className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
											Status <span className="text-red-500">*</span>
										</label>
										<select
											id="status"
											{...register("status", { required: true })}
											className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 text-sm shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
											<option value="draft">Draft</option>
											<option value="published">Published</option>
											<option value="cancelled">Cancel</option>
											<option value="ongoing">Ongoing</option>
											<option value="completed">Complete</option>
										</select>
									</div>
								</div>
							</TabPanel>
						</TabPanels>
					</Tabs>
					<div className="mt-auto pt-6">
						<div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3">
							<Button
								type="button"
								variant="outline"
								disabled={isLoading}
								className="w-full sm:w-auto order-2 sm:order-1"
								onClick={() => {
									navigate("/admin/events");
								}}>
								Batal
							</Button>
							<Button
								type="submit"
								variant="success"
								loading={isLoading}
								disabled={isLoading}
								className="w-full sm:w-auto order-1 sm:order-2">
								{isLoading ? "Menyimpan..." : "Simpan Event"}
							</Button>
						</div>
					</div>
				</form>
			</div>
		</div>
	);
}
