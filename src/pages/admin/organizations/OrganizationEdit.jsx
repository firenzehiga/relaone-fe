import React, { useState, useEffect } from "react";
import {
	useAdminOrganizationById,
	useAdminUpdateOrganizationMutation,
} from "@/_hooks/useOrganizations";
import { useAuthStore } from "@/_hooks/useAuth";
import { UserCircle2Icon, Building2 } from "lucide-react";
import { Input, InputGroup, InputLeftAddon } from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import Skeleton from "@/components/ui/Skeleton";
import Button from "@/components/ui/Button";
import { useAdminOrganizationUsers } from "@/_hooks/useUsers";
import { getImageUrl } from "@/utils";

export default function AdminOrganizationEdit() {
	const { id } = useParams();
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
	const [imagePreview, setImagePreview] = useState(null);

	const { data: showOrganization, isLoading: showOrganizationLoading } =
		useAdminOrganizationById(id);
	const {
		data: organizationUsers = [],
		isLoading: organizationUsersLoading,
		error: organizationUsersError,
	} = useAdminOrganizationUsers();

	const updateOrganizationMutation = useAdminUpdateOrganizationMutation();

	useEffect(() => {
		if (!showOrganization) return;
		setFormData((prev) => {
			// if user already started typing title, don't overwrite
			if (prev.nama) return prev;
			return {
				nama: showOrganization.nama,
				deskripsi: showOrganization.deskripsi,
				alamat: showOrganization.alamat,
				telepon: showOrganization.telepon,
				email: showOrganization.email,
				website: showOrganization.website,
				logo: showOrganization.logo,
				status_verifikasi: showOrganization.status_verifikasi,
				user_id: showOrganization.user_id,
			};
		});

		// Set image preview jika ada logo existing
		if (showOrganization.logo) {
			setImagePreview(getImageUrl(`organizations/${showOrganization.logo}`));
		}
	}, [showOrganization]);

	// buat preview logo saat file diubah
	useEffect(() => {
		let url;
		if (formData.logo instanceof File) {
			url = URL.createObjectURL(formData.logo);
			setImagePreview(url);
		}
		return () => {
			if (url) URL.revokeObjectURL(url);
		};
	}, [formData.logo]);

	const handleChange = (e) => {
		const { name, value, files } = e.target;
		if (name === "logo") {
			const file = files && files[0];
			if (!file) return;

			// allowed mime types and max size (2MB)
			const allowed = ["image/jpeg", "image/png", "image/jpg"];
			const maxSize = 2 * 1024 * 1024; // 2MB

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
			// store actual File object (no object URL preview)
			setFormData((s) => ({ ...s, [name]: file }));
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
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		const payload = new FormData();
		payload.append("_method", "PUT");
		// append form values
		// Note: we purposely do NOT normalize/trim website here per request
		for (const key in formData) {
			if (key === "logo") {
				// only append logo when user selected a new File
				if (formData.logo instanceof File) {
					payload.append("logo", formData.logo);
				}
			} else {
				payload.append(key, formData[key]);
			}
		}

		updateOrganizationMutation.mutateAsync({ id, data: payload });
	};

	if (showOrganizationLoading || organizationUsersLoading) {
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
						Edit Organisasi
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
								placeholder="Alamat lengkap organisasi"
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
										{imagePreview ? (
											<img
												src={imagePreview}
												alt="Preview"
												className="w-28 h-24 rounded-lg object-cover border-4 border-gray-200 shadow-lg"
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
											/>
											<label
												htmlFor="logo"
												className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-600 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors duration-200 text-sm font-medium">
												<Building2 className="w-4 h-4 mr-2" />
												{imagePreview ? "Ganti Logo" : "Upload Logo"}
											</label>
										</div>

										<p className="text-xs text-gray-500">
											Format: JPEG, JPG, PNG. Maksimal 2MB.
										</p>

										{formData.logo && (
											<p className="text-xs text-gray-700">
												{formData.logo instanceof File
													? formData.logo.name
													: "Logo organisasi saat ini"}
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
							disabled={isLoading}
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
							{isLoading ? "Menyimpan..." : "Simpan Organisasi"}
						</Button>
					</div>
				</form>
			</div>
		</div>
	);
}
