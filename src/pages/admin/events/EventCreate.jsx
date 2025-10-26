import React, { useEffect, useRef, useState } from "react";
import { Image as ImageIcon, UserCircle2Icon } from "lucide-react";
import { toast } from "react-hot-toast";

export default function AdminEventCreate() {
	const [formData, setFormData] = useState({
		title: "",
		description: "",
		category: "",
		date: "",
		type: "in-person",
		gambar: null,
	});
	const [previewUrl, setPreviewUrl] = useState(null);
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState("");
	const fileInputRef = useRef(null);

	useEffect(() => {
		return () => {
			if (previewUrl) URL.revokeObjectURL(previewUrl);
		};
	}, [previewUrl]);

	function handleChange(e) {
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
					"File harus berupa gambar JPEG/PNG (webp tidak diperbolehkan).",
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
			if (previewUrl) URL.revokeObjectURL(previewUrl);
			setFormData((s) => ({ ...s, [name]: file }));
			setPreviewUrl(URL.createObjectURL(file));
		} else {
			setFormData((s) => ({ ...s, [name]: value }));
		}
	}

	function removeImage() {
		if (previewUrl) URL.revokeObjectURL(previewUrl);
		setFormData((s) => ({ ...s, gambar: null }));
		setPreviewUrl(null);
		if (fileInputRef.current) fileInputRef.current.value = "";
	}

	function handleDrop(e) {
		e.preventDefault();
		e.stopPropagation();
		const dt = e.dataTransfer;
		if (!dt?.files?.length) return;
		const file = dt.files[0];
		if (!file.type.startsWith("image/")) {
			setError("File harus berupa gambar (jpg/png).");
			return;
		}
		setError("");
		if (previewUrl) URL.revokeObjectURL(previewUrl);
		setFormData((s) => ({ ...s, image: file }));
		setPreviewUrl(URL.createObjectURL(file));
	}

	function handleDragOver(e) {
		e.preventDefault();
	}

	async function handleSubmit(e) {
		e.preventDefault();
		setError("");
		if (!formData.title.trim()) {
			setError("Nama event wajib diisi.");
			return;
		}
		setSubmitting(true);
		try {
			const payload = new FormData();
			for (const key in formData) {
				payload.append(key, formData[key]);
			}

			// TODO: ganti URL berikut dengan endpoint backend Anda
			// const res = await fetch('/api/events', { method: 'POST', body: payload });
			// if (!res.ok) throw new Error('Gagal menyimpan event');

			// Simulate success
			await new Promise((r) => setTimeout(r, 600));
			setFormData({
				title: "",
				description: "",
				category: "",
				date: "",
				type: "in-person",
				image: null,
			});
			removeImage();
			alert("Event berhasil dibuat (simulasi)");
		} catch (err) {
			setError(err.message || "Terjadi kesalahan saat menyimpan.");
		} finally {
			setSubmitting(false);
		}
	}

	return (
		<div className="max-w-5xl mx-auto p-6">
			<div className="bg-white shadow-sm rounded-lg p-6">
				<header className="mb-6">
					<h1 className="text-2xl font-semibold text-gray-900">
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

					<div>
						<label
							htmlFor="title"
							className="block text-sm font-medium text-gray-700">
							Nama Event
						</label>
						<input
							id="title"
							name="title"
							value={formData.title}
							onChange={handleChange}
							type="text"
							placeholder="Contoh: Bersih Pantai"
							className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
						/>
					</div>

					{/* grid: category | date | type */}
					<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
						<div>
							<label
								htmlFor="category"
								className="block text-sm font-medium text-gray-700">
								Kategori
							</label>
							<select
								id="category"
								name="category"
								value={formData.category}
								onChange={handleChange}
								className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
								<option value="">Pilih kategori</option>
								<option value="environment">Environment</option>
								<option value="education">Education</option>
								<option value="health">Health</option>
								<option value="community">Community</option>
							</select>
						</div>

						<div>
							<label
								htmlFor="date"
								className="block text-sm font-medium text-gray-700">
								Tanggal
							</label>
							<input
								id="date"
								name="date"
								type="date"
								value={formData.date}
								onChange={handleChange}
								className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
							/>
						</div>

						<div>
							<fieldset>
								<legend className="text-sm font-medium text-gray-700">
									Tipe Event
								</legend>
								<div className="mt-2 flex gap-4 items-center">
									<label className="inline-flex items-center gap-2">
										<input
											type="radio"
											name="type"
											value="in-person"
											checked={formData.type === "in-person"}
											onChange={handleChange}
											className="form-radio text-indigo-600"
										/>
										<span className="text-sm text-gray-700">In-Person</span>
									</label>
									<label className="inline-flex items-center gap-2">
										<input
											type="radio"
											name="type"
											value="online"
											checked={formData.type === "online"}
											onChange={handleChange}
											className="form-radio text-indigo-600"
										/>
										<span className="text-sm text-gray-700">Online</span>
									</label>
								</div>
							</fieldset>
						</div>
					</div>
					<div>
						<label
							htmlFor="description"
							className="block text-sm font-medium text-gray-700">
							Deskripsi
						</label>
						<textarea
							id="description"
							name="description"
							value={formData.description}
							onChange={handleChange}
							rows={4}
							placeholder="Tulis deskripsi singkat tentang event"
							className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700">
							Gambar Event
						</label>

						<div
							onDrop={handleDrop}
							onDragOver={handleDragOver}
							className="mt-2 flex items-center gap-4">
							<div className="w-40 h-28 flex items-center justify-center rounded-md border-2 border-dashed border-gray-200 bg-gray-50 overflow-hidden">
								{previewUrl ? (
									<img
										src={previewUrl}
										alt="preview"
										className="w-full h-full object-cover"
									/>
								) : (
									<div className="text-gray-300 flex flex-col items-center">
										<ImageIcon className="size-8" />
										<span className="text-xs">Preview</span>
									</div>
								)}
							</div>

							<div className="flex-1">
								<p className="text-sm text-gray-500">
									PNG, JPG, GIF — maksimal 10MB
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
											onChange={handleChange}
											className="sr-only"
										/>
									</label>

									{previewUrl && (
										<button
											type="button"
											onClick={removeImage}
											className="inline-flex items-center px-3 py-2 bg-red-50 text-red-700 border rounded-md text-sm hover:bg-red-100">
											Hapus
										</button>
									)}
								</div>
								<p className="mt-2 text-xs text-gray-400">
									Kamu juga bisa seret & lepas gambar ke area ini.
								</p>
							</div>
						</div>
					</div>

					<div className="flex items-center justify-end gap-3">
						<button
							type="button"
							onClick={() => {
								setTitle("");
								setDescription("");
								removeImage();
							}}
							className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md">
							Batal
						</button>
						<button
							type="submit"
							disabled={submitting}
							className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-500 disabled:opacity-60">
							{submitting ? "Menyimpan..." : "Simpan Event"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
