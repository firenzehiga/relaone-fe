import React, { useRef, useState, useEffect } from "react";
import { useAdminOrganizationUsers } from "@/_hooks/useUsers";
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
		user_id: "",
	});
	const { isLoading } = useAuthStore();

	const [previewUrl, setPreviewUrl] = useState(null);

	const {
		data: organizationUsers = [],
		isLoading: organizationUsersLoading,
		error: organizationUsersError,
	} = useAdminOrganizationUsers();

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
		} else if (name === "user_id") {
			// jika user dipilih sebagai kontak, autofill telepon dan email tapi tetap bisa diedit
			const selected = organizationUsers.find(
				(user) => String(user.id) === String(value)
			);
			setFormData((s) => ({
				...s,
				user_id: value,
				telepon: selected?.telepon || "",
				email: selected?.email || "",
			}));
		} else {
			setFormData((s) => ({ ...s, [name]: value }));
		}
	}

	const handleSubmit = (e) => {
		e.preventDefault();

		const payload = new FormData();
		// normalize website
		const website = formData.website
			? formData.website.trim().startsWith("http")
				? formData.website.trim()
				: `https://${formData.website.trim()}`
			: "";
		const dataToAppend = { ...formData, website };
		for (const key in dataToAppend) {
			const val = dataToAppend[key];
			if (val === null || val === undefined) continue;
			payload.append(key, val);
		}

		createOrganizationMutation.mutateAsync(payload);
	};

	if (organizationUsersLoading) {
		return <Skeleton.FormSkeleton title="Loading..." />;
	}

	if (organizationUsersError) {
		return <div>Error: {organizationUsersError?.message}</div>;
	}

	return (
		<div className="max-w-6xl mx-auto p-6">
			<div
				className="bg-white shadow-sm rounded-lg p-6"
				style={{ minHeight: 420, width: 900 }}>
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
								Website
							</label>
							<div className="mt-1">
								<InputGroup>
									<InputLeftAddon
										children={<span className="text-sm">https://</span>}
									/>
									<Input
										name="website"
										type="text"
										required
										value={formData.website}
										onChange={handleChange}
										placeholder="yoursite.com"
									/>
								</InputGroup>
							</div>
						</div>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div>
							<label className="block text-sm font-medium text-gray-700">
								Kontak
							</label>
							<select
								name="user_id"
								value={formData.user_id}
								required
								onChange={handleChange}
								className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
								<option value="">Pilih kontak (nama / telepon)</option>
								{organizationUsers.map((user) => (
									<option key={user.id} value={user.id}>
										{(user.nama || user.name || user.email) +
											" — " +
											(user.telepon || user.email)}
									</option>
								))}
							</select>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700">
								Status Akun
							</label>
							<select
								name="status_verifikasi"
								value={formData.status_verifikasi}
								required
								onChange={handleChange}
								className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
								<option value="">Pilih status</option>
								<option value="pending">Pending</option>
								<option value="verified">Disetujui</option>
								<option value="rejected">Ditolak</option>
							</select>
						</div>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div>
							<label className="block text-sm font-medium text-gray-700">
								Telepon
							</label>
							<input
								name="telepon"
								value={formData.telepon}
								onChange={handleChange}
								placeholder="pilih kontak untuk mengisi otomatis"
								disabled
								required
								className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700">
								Email <span className="text-red-500">*</span>
							</label>
							<input
								name="email"
								value={formData.email}
								onChange={handleChange}
								placeholder="pilih kontak untuk mengisi otomatis"
								disabled
								required
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
							<label className="block text-sm font-medium text-gray-700">
								Deskripsi
							</label>
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

										<p className="text-xs text-gray-500">
											Format: JPEG, JPG, PNG. Maksimal 2MB.
										</p>

										{formData.logo && (
											<p className="text-xs text-gray-700">
												{formData.logo.name}
											</p>
										)}
									</div>
								</div>
							</div>
						</div>

						<div className="md:col-span-2"></div>
					</div>

					<div className="flex items-center justify-end gap-3">
						<Button
							type="button"
							variant="secondary"
							onClick={() => {
								navigate("/admin/organizations");
							}}>
							Batal
						</Button>
						<Button
							type="submit"
							variant="success"
							loading={isLoading}
							disabled={isLoading}>
							{isLoading ? "Membuat..." : "Buat Organisasi"}
						</Button>
					</div>
				</form>
			</div>
		</div>
	);
}
