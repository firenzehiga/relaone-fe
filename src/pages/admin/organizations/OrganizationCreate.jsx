import React, { useRef, useState, useEffect } from "react";
import { UserCircle2Icon } from "lucide-react";
import { Input, InputGroup, InputLeftAddon } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export default function AdminOrganizationCreate() {
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		name: "",
		description: "",
		website: "",
		logo: null,
	});
	const [previewUrl, setPreviewUrl] = useState(null);
	const fileRef = useRef(null);

	useEffect(() => {
		return () => {
			if (previewUrl) URL.revokeObjectURL(previewUrl);
		};
	}, [previewUrl]);

	function handleChange(e) {
		const { name, value, files } = e.target;
		if (name === "logo" && files) {
			const file = files[0];
			if (!file) return;
			if (!file.type.startsWith("image/")) return;
			if (previewUrl) URL.revokeObjectURL(previewUrl);
			setFormData((s) => ({ ...s, [name]: file }));
			setPreviewUrl(URL.createObjectURL(file));
		} else {
			setFormData((s) => ({ ...s, [name]: value }));
		}
	}

	function removeLogo() {
		if (previewUrl) URL.revokeObjectURL(previewUrl);
		setFormData((s) => ({ ...s, logo: null }));
		setPreviewUrl(null);
		if (fileRef.current) fileRef.current.value = "";
	}

	function handleSubmit(e) {
		e.preventDefault();
		if (!formData.name.trim()) return alert("Nama organisasi wajib diisi");

		try {
			const payload = new FormData();
			// normalize website
			const website = formData.website
				? formData.website.trim().startsWith("http")
					? formData.website.trim()
					: `https://${formData.website.trim()}`
				: "";
			const dataToAppend = { ...formData, website };
			for (const key in dataToAppend) {
				payload.append(key, dataToAppend[key]);
			}

			// TODO: kirim payload ke backend
			console.log("submit payload", { ...dataToAppend });
			alert("Organisasi disimpan (simulasi)");

			// reset
			setFormData({ name: "", description: "", website: "", logo: null });
			removeLogo();
			navigate("/admin/organizations");
		} catch (err) {
			console.error(err);
			alert("Gagal menyimpan organisasi.");
		}
	}

	return (
		<div className="max-w-4xl mx-auto p-6">
			<div className="bg-white shadow-sm rounded-lg p-6">
				<header className="mb-6">
					<h1 className="text-2xl font-semibold text-gray-900">
						Buat Organisasi Baru
					</h1>
					<p className="text-sm text-gray-500 mt-1">
						Isi detail organisasi dan tambahkan website serta logo.
					</p>
				</header>

				<form onSubmit={handleSubmit} className="space-y-6">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div>
							<label className="block text-sm font-medium text-gray-700">
								Nama Organisasi
							</label>
							<input
								name="name"
								value={formData.name}
								onChange={handleChange}
								type="text"
								placeholder="Contoh: Komunitas Bersih Pantai"
								className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700">
								Website
							</label>
							<div className="mt-1">
								<InputGroup>
									<InputLeftAddon
										children={<span className="text-sm">https://</span>}
									/>
									<Input
										name="website"
										value={formData.website}
										onChange={handleChange}
										placeholder="yoursite.com"
									/>
								</InputGroup>
							</div>
						</div>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700">
							Deskripsi
						</label>
						<textarea
							name="description"
							value={formData.description}
							onChange={handleChange}
							rows={4}
							className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
							placeholder="Deskripsi singkat organisasi"
						/>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
						<div className="col-span-1">
							<label className="block text-sm font-medium text-gray-700">
								Logo
							</label>
							<div className="mt-2 flex items-center gap-4">
								<div className="w-28 h-20 rounded-md border border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden">
									{previewUrl ? (
										<img
											src={previewUrl}
											alt="logo"
											className="w-full h-full object-cover"
										/>
									) : (
										<UserCircle2Icon className="text-gray-300 size-12" />
									)}
								</div>
								<div className="flex flex-col gap-2">
									<label className="inline-flex items-center px-3 py-2 bg-white border rounded-md text-sm text-gray-700 hover:bg-gray-50 cursor-pointer">
										Pilih Logo
										<input
											name="logo"
											ref={fileRef}
											onChange={handleChange}
											type="file"
											accept="image/*"
											className="sr-only"
										/>
									</label>
									{previewUrl && (
										<button
											type="button"
											onClick={removeLogo}
											className="text-sm text-red-600">
											Hapus
										</button>
									)}
								</div>
							</div>
						</div>

						<div className="md:col-span-2"></div>
					</div>

					<div className="flex items-center justify-end gap-3">
						<button
							type="button"
							onClick={() => {
								setName("");
								setDescription("");
								setWebsiteName("");
								setWebsiteDomain(".com");
								removeLogo();
								navigate("/admin/organizations");
							}}
							className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md">
							Batal
						</button>
						<button
							type="submit"
							className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-500">
							Simpan Organisasi
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
