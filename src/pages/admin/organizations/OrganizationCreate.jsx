import React, { useRef, useState, useEffect } from "react";
import { useAdminCreateOrganizationMutation } from "@/_hooks/useOrganizations";
import { useAuthStore } from "@/_hooks/useAuth";
import { UserCircle2Icon, Building2 } from "lucide-react";
import { Input, InputGroup, InputLeftAddon } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import Skeleton from "@/components/ui/Skeleton";
import Button from "@/components/ui/Button";

export default function AdminOrganizationCreate() {
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		nama: "",
		deskripsi: "",
		alamat: "",
		telepon: "",
		email: "",
		website: "",
		logo: null,
		status_verifikasi: "pending",
		// user fields for new account (backend expects user_nama,user_email,user_password when no user_id)
		user_nama: "", // User's name
		user_email: "", // User's email
		user_password: "", // User's password
	});
	const { isLoading } = useAuthStore();

	const [previewUrl, setPreviewUrl] = useState(null);

	const createOrganizationMutation = useAdminCreateOrganizationMutation();

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

			const allowed = ["image/jpeg", "image/png", "image/jpg"];
			const maxSize = 2 * 1024 * 1024;
			if (!allowed.includes(file.type)) {
				toast.error("Logo harus berupa gambar JPEG/PNG/JPG.", {
					position: "top-center",
				});
				return;
			}
			if (file.size > maxSize) {
				toast.error("Ukuran logo maksimal 2MB.", { position: "top-center" });
				return;
			}

			if (previewUrl) URL.revokeObjectURL(previewUrl);
			setFormData((s) => ({ ...s, [name]: file }));
			setPreviewUrl(URL.createObjectURL(file));
		} else {
			setFormData((s) => ({ ...s, [name]: value }));
		}
	}

	const handleSubmit = (e) => {
		e.preventDefault();

		const payload = new FormData();
		const dataToAppend = { ...formData };
		for (const key in dataToAppend) {
			const val = dataToAppend[key];
			if (val === null || val === undefined) continue;
			payload.append(key, val);
		}

		createOrganizationMutation.mutateAsync(payload);
	};

	return (
		<div className="max-w-6xl mx-auto p-6">
			<div className="bg-white shadow-sm rounded-lg p-6" style={{ minHeight: 420, width: 900 }}>
				<header className="mb-6">
					<h1 className="text-2xl font-semibold text-gray-900">Buat Organisasi Baru</h1>
					<p className="text-sm text-gray-500 mt-1">
						Isi detail organisasi dan tambahkan website serta logo.
					</p>
				</header>

				<form onSubmit={handleSubmit} className="space-y-6">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div>
							<label className="block text-sm font-medium text-gray-700">
								Nama Organisasi <span className="text-red-500">*</span>
							</label>
							<input
								name="nama"
								value={formData.nama}
								onChange={handleChange}
								type="text"
								placeholder="Contoh: Komunitas Bersih Pantai"
								className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700">
								Website / Company Profile
							</label>
							<div className="mt-1">
								<InputGroup>
									<Input
										name="website"
										type="url"
										required
										value={formData.website}
										onChange={handleChange}
										placeholder="diawali dengan https://"
									/>
								</InputGroup>
							</div>
						</div>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div>
							<label className="block text-sm font-medium text-gray-700">
								Email Organisasi <span className="text-red-500">*</span>
							</label>
							<input
								name="email"
								value={formData.email}
								onChange={handleChange}
								placeholder="contoh@organisasi.id"
								required
								className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700">
								Telepon Organisasi <span className="text-red-500">*</span>
							</label>
							<input
								name="telepon"
								value={formData.telepon}
								onChange={handleChange}
								placeholder="0812xxxx"
								className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2"
							/>
						</div>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
						<div>
							<label className="block text-sm font-medium text-gray-700">
								Alamat <span className="text-red-500">*</span>
							</label>
							<textarea
								name="alamat"
								value={formData.alamat}
								onChange={handleChange}
								rows={4}
								required
								className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
								placeholder="Deskripsi singkat organisasi"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700">Deskripsi</label>
							<textarea
								name="deskripsi"
								value={formData.deskripsi}
								onChange={handleChange}
								rows={4}
								required
								className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
								placeholder="Deskripsi singkat organisasi"
							/>
						</div>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
						<div className="col-span-1">
							<label className="block text-sm font-medium text-gray-700">
								Logo <span className="text-red-500">*</span>
							</label>
							<div className="mt-2">
								<div className="flex items-center space-x-6">
									{/* Logo Preview */}
									<div className="relative">
										{previewUrl ? (
											<img
												src={previewUrl}
												alt="Preview"
												className="w-24 h-24 rounded-lg object-cover border-4 border-white shadow-lg"
											/>
										) : (
											<div className="w-24 h-24 rounded-lg bg-gray-200 flex items-center justify-center border-4 border-white shadow-lg">
												<Building2 className="w-12 h-12 text-gray-400" />
											</div>
										)}
									</div>

									{/* Upload Button and Info */}
									<div className="flex flex-col space-y-2">
										<div className="relative">
											<input
												type="file"
												id="logo"
												name="logo"
												accept="image/jpeg,image/jpg,image/png"
												onChange={handleChange}
												className="hidden"
												required
											/>
											<label
												htmlFor="logo"
												className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-600 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors duration-200 text-sm font-medium">
												<Building2 className="w-4 h-4 mr-2" />
												{previewUrl ? "Ganti Logo" : "Upload Logo"}
											</label>
										</div>

										<p className="text-xs text-gray-500">Format: JPEG, JPG, PNG. Maksimal 2MB.</p>

										{formData.logo && <p className="text-xs text-gray-700">{formData.logo.name}</p>}
									</div>
								</div>
							</div>
						</div>

						<div className="md:col-span-2"></div>
					</div>

					<div className="flex items-center justify-end gap-3">
						{/* User account section: created automatically when admin doesn't provide existing user */}
						<div className="w-full border rounded-md bg-gray-50 p-4 mb-4">
							<h3 className="font-semibold mb-2">
								Akun Pengelola Organisasi (akan dibuat otomatis)
							</h3>
							<p className="text-sm text-gray-600 mb-3">
								Isi data akun pengelola yang akan dikaitkan ke organisasi.
							</p>
							<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
								<div>
									<label className="block text-sm font-medium">
										Nama Pengguna <span className="text-red-500">*</span>
									</label>
									<input
										name="user_nama"
										value={formData.user_nama}
										onChange={handleChange}
										required
										className="mt-1 block w-full rounded-md border px-3 py-2"
									/>
								</div>

								<div>
									<label className="block text-sm font-medium">
										Email Pengguna <span className="text-red-500">*</span>
									</label>
									<input
										name="user_email"
										type="email"
										value={formData.user_email}
										onChange={handleChange}
										required
										className="mt-1 block w-full rounded-md border px-3 py-2"
									/>
								</div>

								<div>
									<label className="block text-sm font-medium">
										Password Akun <span className="text-red-500">*</span>
									</label>
									<input
										name="user_password"
										type="password"
										value={formData.user_password}
										onChange={handleChange}
										required
										className="mt-1 block w-full rounded-md border px-3 py-2"
									/>
								</div>
							</div>
						</div>
						<Button
							type="button"
							variant="secondary"
							onClick={() => {
								navigate("/admin/organizations");
							}}>
							Batal
						</Button>
						<Button type="submit" variant="success" loading={isLoading} disabled={isLoading}>
							{isLoading ? "Membuat..." : "Buat Organisasi"}
						</Button>
					</div>
				</form>
			</div>
		</div>
	);
}
