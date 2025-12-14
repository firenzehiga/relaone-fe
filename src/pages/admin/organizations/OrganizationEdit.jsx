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
// contact selection removed — no longer using useAdminOrganizationUsers
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

	const {
		data: showOrganization,
		isLoading: showOrganizationLoading,
		error,
	} = useAdminOrganizationById(id);
	// organizationUsers removed — admin will edit email/telepon directly

	const updateOrganizationMutation = useAdminUpdateOrganizationMutation();

	useEffect(() => {
		if (!showOrganization) return;
		setFormData((prev) => {
			// if user already started typing title, don't overwrite
			if (prev.nama) return prev;
			return {
				nama: showOrganization.nama || "",
				deskripsi: showOrganization.deskripsi || "",
				alamat: showOrganization.alamat || "",
				telepon: showOrganization.telepon || "",
				email: showOrganization.email || "",
				website: showOrganization.website || "",
				logo: showOrganization.logo || "",
				status_verifikasi: showOrganization.status_verifikasi || "",
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
			// store actual File object (no object URL preview)
			setFormData((s) => ({ ...s, [name]: file }));
		} else {
			setFormData((s) => ({ ...s, [name]: value }));
		}
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		const payload = new FormData();
		payload.append("_method", "PUT");
		// append form values
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

	if (showOrganizationLoading) {
		return <Skeleton.FormSkeleton title="Loading..." />;
	}
	if (error) {
		return <div>Error: {error?.message}</div>;
	}
	return (
		<div className="w-full mx-auto p-4 sm:p-6 max-w-6xl min-h-[calc(100vh-4rem)]">
			<div className="bg-white shadow-xl rounded-lg p-4 sm:p-6">
				<header className="mb-6 sm:mb-8">
					<h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Edit Organisasi</h1>
					<p className="text-xs sm:text-sm text-gray-500 mt-1">
						Isi detail organisasi dan tambahkan website serta logo.
					</p>
				</header>

				<form onSubmit={handleSubmit} className="space-y-6">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div>
							<label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
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
							<label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
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
							<label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
								Email Organisasi<span className="text-red-500">*</span>
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
							<label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
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
							<label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
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
							<label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
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
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div>
							<label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
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
								<option value="verified">Verified</option>
								<option value="rejected">Rejected</option>
							</select>
						</div>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
						<div className="col-span-1">
							<label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
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

										<p className="text-xs text-gray-500">Format: JPEG, JPG, PNG. Maksimal 2MB.</p>

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
						<Button type="submit" variant="success" loading={isLoading} disabled={isLoading}>
							{isLoading ? "Menyimpan..." : "Simpan Organisasi"}
						</Button>
					</div>
				</form>
			</div>
		</div>
	);
}
