import React, { useRef, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useAdminCreateOrganizationMutation } from "@/_hooks/useOrganizations";
import { useAuthStore } from "@/_hooks/useAuth";
import { UserCircle2Icon, Building2 } from "lucide-react";
import { Input, InputGroup, InputLeftAddon } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import CustomSkeleton from "@/components/ui/CustomSkeleton";
import Button from "@/components/ui/DynamicButton";

export default function AdminOrganizationCreate() {
	const navigate = useNavigate();
	const { register, handleSubmit, setValue, getValues, reset } = useForm({
		defaultValues: {
			nama: "",
			deskripsi: "",
			alamat: "",
			telepon: "",
			email: "",
			website: "",
			logo: null,
			status_verifikasi: "pending",
			user_nama: "",
			user_email: "",
			user_password: "",
		},
	});
	const { isLoading } = useAuthStore();

	const [previewUrl, setPreviewUrl] = useState(null);

	const createOrganizationMutation = useAdminCreateOrganizationMutation();

	useEffect(() => {
		return () => {
			if (previewUrl) URL.revokeObjectURL(previewUrl);
		};
	}, [previewUrl]);

	const handleFileChange = (e) => {
		const file = e.target.files && e.target.files[0];
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
		setValue("logo", file, { shouldDirty: true });
		setPreviewUrl(URL.createObjectURL(file));
	};

	const onSubmit = (data) => {
		const payload = new FormData();
		for (const key in data) {
			const val = data[key];
			if (val === null || val === undefined) continue;
			// append file properly
			if (key === "logo" && val instanceof File) {
				payload.append("logo", val);
			} else {
				payload.append(key, val);
			}
		}

		createOrganizationMutation.mutateAsync(payload);
	};

	return (
		<div className="w-full mx-auto p-4 sm:p-6 max-w-6xl min-h-[calc(100vh-4rem)]">
			<div className="bg-white shadow-xl rounded-lg p-4 sm:p-6">
				<header className="mb-6 sm:mb-8">
					<h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
						Buat Organisasi Baru
					</h1>
					<p className="text-xs sm:text-sm text-gray-500 mt-1">
						Isi detail organisasi dan tambahkan website serta logo.
					</p>
				</header>

				<form
					onSubmit={handleSubmit(onSubmit)}
					className="space-y-6 flex flex-col">
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
						<div>
							<label
								htmlFor="nama"
								className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
								Nama Organisasi <span className="text-red-500">*</span>
							</label>
							<input
								id="nama"
								{...register("nama", { required: true })}
								type="text"
								placeholder="Contoh: Komunitas Bersih Pantai"
								className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
							/>
						</div>

						<div>
							<label
								htmlFor="website"
								className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
								Website / Company Profile
							</label>
							<div className="mt-1">
								<InputGroup>
									<Input
										id="website"
										{...register("website")}
										name="website"
										type="url"
										placeholder="diawali dengan https://"
									/>
								</InputGroup>
							</div>
						</div>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div>
							<label
								htmlFor="email"
								className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
								Email Organisasi <span className="text-red-500">*</span>
							</label>
							<input
								id="email"
								{...register("email", { required: true })}
								placeholder="contoh@organisasi.id"
								className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2"
							/>
						</div>
						<div>
							<label
								htmlFor="telepon"
								className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
								Telepon Organisasi <span className="text-red-500">*</span>
							</label>
							<input
								id="telepon"
								{...register("telepon")}
								placeholder="0812xxxx"
								className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2"
							/>
						</div>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
						<div>
							<label
								htmlFor="alamat"
								className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
								Alamat <span className="text-red-500">*</span>
							</label>
							<textarea
								id="alamat"
								{...register("alamat", { required: true })}
								rows={4}
								className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
								placeholder="Deskripsi singkat organisasi"
							/>
						</div>
						<div>
							<label
								htmlFor="deskripsi"
								className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
								Deskripsi
							</label>
							<textarea
								id="deskripsi"
								{...register("deskripsi")}
								rows={4}
								className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
								placeholder="Deskripsi singkat organisasi"
							/>
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
												onChange={handleFileChange}
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

										{getValues("logo") && getValues("logo") instanceof File && (
											<p className="text-xs text-gray-700">
												{getValues("logo").name}
											</p>
										)}
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
									<label
										htmlFor="user_nama"
										className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
										Nama Pengguna <span className="text-red-500">*</span>
									</label>
									<input
										id="user_nama"
										{...register("user_nama", { required: true })}
										required
										className="mt-1 block w-full rounded-md border px-3 py-2"
									/>
								</div>

								<div>
									<label
										htmlFor="user_email"
										className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
										Email Pengguna <span className="text-red-500">*</span>
									</label>
									<input
										id="user_email"
										{...register("user_email", { required: true })}
										type="email"
										required
										className="mt-1 block w-full rounded-md border px-3 py-2"
									/>
								</div>

								<div>
									<label
										htmlFor="user_password"
										className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
										Password Akun <span className="text-red-500">*</span>
									</label>
									<input
										id="user_password"
										{...register("user_password", { required: true })}
										type="password"
										required
										className="mt-1 block w-full rounded-md border px-3 py-2"
									/>
								</div>
							</div>
						</div>
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
