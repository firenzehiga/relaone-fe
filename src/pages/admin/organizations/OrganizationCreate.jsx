import React, { useRef, useState, useEffect } from "react";
import { useAdminOrganizationUsers } from "@/_hooks/useUsers";
import { useAdminCreateOrganizationMutation } from "@/_hooks/useOrganizations";
import { useAuthStore } from "@/_hooks/useAuth";
import { UserCircle2Icon } from "lucide-react";
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
		telepon: "",
		email: "",
		website: "",
		logo: null,
		status_verifikasi: "pending",
		user_id: "",
	});
	const { isLoading } = useAuthStore();

	const [previewUrl, setPreviewUrl] = useState(null);
	const fileRef = useRef(null);

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
								Nama Organisasi
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
								Email
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
											accept="image/jpeg,image/png,image/jpg"
											required
											className="sr-only"
										/>
									</label>
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
