import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// UI Libraries
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
	User,
	Mail,
	Phone,
	MapPin,
	Save,
	ArrowLeft,
	FileText,
	UserCircle2,
	Building2,
	Globe,
	ImageIcon,
} from "lucide-react";

// Hooks / Stores
import { useUpdateUserMutation, useUserProfile } from "@/_hooks/useUsers";
import { useAuthStore } from "@/_hooks/useAuth";
import { useDocumentTitle } from "@/_hooks/utils/useDocumentTitle";

// Helpers
import { toInputDate } from "@/utils/dateFormatter";
import { getImageUrl } from "@/utils";

// UI Components
import CustomSkeleton from "@/components/ui/CustomSkeleton";
import Button from "@/components/ui/DynamicButton";
import Card from "@/components/ui/Card";
import { DatePicker } from "@/components/ui/date-picker";
import { useForm, Controller } from "react-hook-form";

/**
 * Halaman Edit Profile Volunteer
 * Form untuk mengedit informasi profile user yang sedang login
 *
 * HYBRID APPROACH:
 * 1. Prioritaskan data dari navigate state (dari ProfilePage) untuk UX yang lebih cepat
 * 2. Fallback ke React Query jika user akses direct URL atau refresh
 * 3. Memberikan best of both worlds: speed + reliability
 */
export default function OrganizationEditProfilePage() {
	useDocumentTitle("Edit Profile Page");

	const navigate = useNavigate();

	const {
		register,
		handleSubmit: rhfHandleSubmit,
		setValue,
		watch,
		reset,
		getValues,
		control,
	} = useForm({
		defaultValues: {
			nama: "",
			email: "",
			telepon: "",
			alamat: "",
			tanggal_lahir: "",
			jenis_kelamin: "",
			bio: "",
			foto_profil: null,
			// Organization specific fields
			organization_nama: "",
			organization_deskripsi: "",
			organization_telepon: "",
			organization_website: "",
			organization_logo: null,
		},
	});

	const [imagePreview, setImagePreview] = useState(null);
	const [logoPreview, setLogoPreview] = useState(null);
	const [errors, setErrors] = useState({});
	const { isLoading } = useAuthStore();

	const {
		data: profileData,
		isLoading: isLoadingProfile,
		error,
	} = useUserProfile();
	const updateProfileMutation = useUpdateUserMutation();

	useEffect(() => {
		if (!profileData) return;
		if (getValues("nama")) return;
		reset({
			nama: profileData.nama || "",
			email: profileData.email || "",
			telepon: profileData.telepon || "",
			alamat: profileData.alamat || "",
			tanggal_lahir: toInputDate(profileData.tanggal_lahir) || "",
			jenis_kelamin: profileData.jenis_kelamin || "",
			bio: profileData.bio || "",
			foto_profil: profileData.foto_profil || null,
			organization_nama: profileData.role_data?.nama || "",
			organization_deskripsi: profileData.role_data?.deskripsi || "",
			organization_telepon: profileData.role_data?.telepon || "",
			organization_website: profileData.role_data?.website || "",
			organization_logo: profileData.role_data?.logo || null,
		});

		if (profileData.foto_profil) {
			setImagePreview(getImageUrl(`foto_profil/${profileData.foto_profil}`));
		}
		if (profileData.role_data?.logo) {
			setLogoPreview(
				getImageUrl(`organizations/${profileData.role_data.logo}`),
			);
		}
	}, [profileData]);

	const foto = watch("foto_profil");
	const orgLogo = watch("organization_logo");

	useEffect(() => {
		let url;
		if (foto instanceof File) {
			url = URL.createObjectURL(foto);
			setImagePreview(url);
		}
		return () => {
			if (url) URL.revokeObjectURL(url);
		};
	}, [foto]);

	useEffect(() => {
		let url;
		if (orgLogo instanceof File) {
			url = URL.createObjectURL(orgLogo);
			setLogoPreview(url);
		}
		return () => {
			if (url) URL.revokeObjectURL(url);
		};
	}, [orgLogo]);

	const handleFileChange = (e) => {
		const { name, files } = e.target;
		const file = files && files[0];
		if (!file) return;
		const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
		const maxSize = 2 * 1024 * 1024;
		if (!allowedTypes.includes(file.type)) {
			toast.error("Format file tidak didukung. Gunakan JPEG, JPG, atau PNG.");
			return;
		}
		if (file.size > maxSize) {
			toast.error("Ukuran file terlalu besar. Maksimal 2MB.");
			return;
		}
		setValue(name, file, { shouldDirty: true });
	};

	const validateForm = () => {
		const values = getValues();
		const newErrors = {};
		if (!values.nama || !values.nama.trim())
			newErrors.nama = "Nama harus diisi";
		else if (values.nama.length < 2) newErrors.nama = "Nama minimal 2 karakter";
		if (!values.email || !values.email.trim())
			newErrors.email = "Email harus diisi";
		else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email))
			newErrors.email = "Format email tidak valid";
		if (values.telepon && !/^[\d\s\-\+\(\)]+$/.test(values.telepon))
			newErrors.telepon = "Format nomor telefon tidak valid";

		if (!values.organization_nama || !values.organization_nama.trim())
			newErrors.organization_nama = "Nama organisasi harus diisi";
		if (
			values.organization_telepon &&
			!/^[\d\s\-\+\(\)]+$/.test(values.organization_telepon)
		)
			newErrors.organization_telepon =
				"Format nomor telefon organisasi tidak valid";
		if (
			values.organization_website &&
			!/^https?:\/\/.+/.test(values.organization_website)
		)
			newErrors.organization_website =
				"Format website tidak valid (harus dimulai dengan http:// atau https://)";

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const onFormSubmit = () => {
		if (!validateForm()) {
			toast.error("Mohon perbaiki kesalahan pada form");
			return;
		}
		const values = getValues();
		const payload = new FormData();
		payload.append("_method", "PUT");
		for (const key in values) {
			const val = values[key];
			if (key === "foto_profil") {
				if (val instanceof File) payload.append("foto_profil", val);
			} else if (key === "organization_logo") {
				if (val instanceof File) payload.append("organization_logo", val);
			} else {
				payload.append(key, val ?? "");
			}
		}
		updateProfileMutation.mutateAsync({ userData: payload });
	};

	// Loading state hanya ditampilkan jika tidak ada data dari state dan sedang loading
	if (isLoadingProfile) {
		return <CustomSkeleton.FormSkeleton />;
	}

	// Error state hanya jika tidak ada data sama sekali
	if (error) {
		return (
			<Card className="max-w-md text-center">
				<div className="text-red-500 mb-4">
					<User className="w-16 h-16 mx-auto mb-4" />
				</div>
				<h2 className="text-xl font-bold text-gray-900 mb-2">
					Gagal Memuat Data
				</h2>
				<p className="text-gray-600 mb-4">
					Terjadi kesalahan saat memuat data profile
				</p>
				<Button
					onClick={() => navigate("/organization/profile")}
					variant="primary">
					Kembali ke Profile
				</Button>
			</Card>
		);
	}

	const containerVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				duration: 0.6,
				staggerChildren: 0.1,
			},
		},
	};

	const itemVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: { opacity: 1, y: 0 },
	};

	return (
		<motion.div
			className="max-w-7xl mx-auto"
			variants={containerVariants}
			initial="hidden"
			animate="visible">
			{/* Header Section - Compact */}
			<motion.div
				variants={itemVariants}
				className="flex items-center justify-between mb-6">
				<div>
					<h1 className="text-2xl font-bold text-gray-900 mb-1">
						Edit Profile Organisasi
					</h1>
					<p className="text-gray-600 text-sm">
						Perbarui informasi profile dan organisasi Anda
					</p>
				</div>
				<Button
					variant="outline"
					onClick={() => navigate("/organization/profile")}
					className="flex items-center"
					size="sm">
					<ArrowLeft className="w-3 h-3 mr-2" />
					Kembali
				</Button>
			</motion.div>

			<form onSubmit={rhfHandleSubmit(onFormSubmit)}>
				{/* Single Combined Card */}
				<motion.div variants={itemVariants}>
					<Card>
						{/* Photo Upload Section */}
						<div className="mb-6 border-b border-gray-100 pb-6">
							<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
								{/* User Photo */}
								<div>
									<div className="flex items-center mb-4">
										<UserCircle2 className="w-5 h-5 text-blue-500 mr-2" />
										<h3 className="text-lg font-bold text-gray-900">
											Foto Profil Pengguna
										</h3>
									</div>
									<div className="flex items-center space-x-6">
										{/* Image Preview */}
										<div className="relative">
											{imagePreview ? (
												<img
													src={imagePreview}
													alt="Preview"
													className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
												/>
											) : (
												<div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center border-4 border-white shadow-lg">
													<UserCircle2 className="w-12 h-12 text-gray-400" />
												</div>
											)}
										</div>

										{/* Upload Button and Info */}
										<div className="flex flex-col space-y-2">
											<div className="relative">
												<input
													type="file"
													id="foto_profil"
													name="foto_profil"
													accept="image/jpeg,image/jpg,image/png"
													onChange={handleFileChange}
													className="hidden"
												/>
												<label
													htmlFor="foto_profil"
													className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-600 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors duration-200 text-sm font-medium">
													<UserCircle2 className="w-4 h-4 mr-2" />
													{imagePreview ? "Ganti Foto" : "Upload Foto"}
												</label>
											</div>

											<p className="text-xs text-gray-500">
												Format: JPEG, JPG, PNG. Maksimal 2MB.
											</p>

											{errors.foto_profil && (
												<p className="text-xs text-red-600">
													{errors.foto_profil}
												</p>
											)}
										</div>
									</div>
								</div>

								{/* Organization Logo */}
								<div>
									<div className="flex items-center mb-4">
										<Building2 className="w-5 h-5 text-purple-500 mr-2" />
										<h3 className="text-lg font-bold text-gray-900">
											Logo Organisasi
										</h3>
									</div>
									<div className="flex items-center space-x-6">
										{/* Logo Preview */}
										<div className="relative">
											{logoPreview ? (
												<img
													src={logoPreview}
													alt="Logo Preview"
													className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
												/>
											) : (
												<div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center border-4 border-white shadow-lg">
													<Building2 className="w-12 h-12 text-gray-400" />
												</div>
											)}
										</div>

										{/* Upload Button and Info */}
										<div className="flex flex-col space-y-2">
											<div className="relative">
												<input
													type="file"
													id="organization_logo"
													name="organization_logo"
													accept="image/jpeg,image/jpg,image/png"
													onChange={handleFileChange}
													className="hidden"
												/>
												<label
													htmlFor="organization_logo"
													className="inline-flex items-center px-4 py-2 bg-purple-50 text-purple-600 rounded-lg cursor-pointer hover:bg-purple-100 transition-colors duration-200 text-sm font-medium">
													<ImageIcon className="w-4 h-4 mr-2" />
													{logoPreview ? "Ganti Logo" : "Upload Logo"}
												</label>
											</div>

											<p className="text-xs text-gray-500">
												Format: JPEG, JPG, PNG. Maksimal 2MB.
											</p>

											{errors.organization_logo && (
												<p className="text-xs text-red-600">
													{errors.organization_logo}
												</p>
											)}
										</div>
									</div>
								</div>
							</div>
						</div>

						<div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
							{/* Left Column - Personal Information */}
							<div>
								<div className="flex items-center mb-4">
									<User className="w-5 h-5 text-blue-500 mr-2" />
									<h3 className="text-lg font-bold text-gray-900">
										Informasi Perwakilan
									</h3>
									<span className="text-xs text-gray-500 ml-2">
										(Pengguna yang mewakili organisasi)
									</span>
								</div>

								<div className="space-y-4">
									{/* Nama */}
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-1">
											Nama Lengkap <span className="text-red-500">*</span>
										</label>
										<div className="relative">
											<User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
											<input
												id="nama"
												{...register("nama")}
												type="text"
												className={`w-full pl-9 pr-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm ${
													errors.nama ? "border-red-500" : "border-gray-300"
												}`}
												placeholder="Masukkan nama lengkap"
											/>
										</div>
										{errors.nama && (
											<p className="mt-1 text-xs text-red-600">{errors.nama}</p>
										)}
									</div>

									{/* Email */}
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-1">
											Email <span className="text-red-500">*</span>
										</label>
										<div className="relative">
											<Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
											<input
												id="email"
												{...register("email")}
												type="email"
												disabled
												className="w-full pl-9 pr-3 py-2 border bg-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm border-gray-300"
												placeholder="Masukkan email"
											/>
										</div>
										{errors.email && (
											<p className="mt-1 text-xs text-red-600">
												{errors.email}
											</p>
										)}
									</div>

									{/* Phone */}
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-1">
											Nomor Telepon
										</label>
										<div className="relative">
											<Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
											<input
												id="telepon"
												{...register("telepon")}
												type="tel"
												className={`w-full pl-9 pr-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm ${
													errors.telepon ? "border-red-500" : "border-gray-300"
												}`}
												placeholder="Masukkan nomor telefon"
											/>
										</div>
										{errors.telepon && (
											<p className="mt-1 text-xs text-red-600">
												{errors.telepon}
											</p>
										)}
									</div>

									{/* Tanggal Lahir */}
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-1">
											Tanggal Lahir
										</label>
										<Controller
											control={control}
											name="tanggal_lahir"
											render={({ field }) => (
												<DatePicker
													value={field.value ? new Date(field.value) : null}
													onChange={(date) => {
														if (date) {
															const year = date.getFullYear();
															const month = String(
																date.getMonth() + 1,
															).padStart(2, "0");
															const day = String(date.getDate()).padStart(
																2,
																"0",
															);
															field.onChange(`${year}-${month}-${day}`);
														} else {
															field.onChange(null);
														}
													}}
													label="Tanggal Lahir"
													placeholder="Pilih tanggal lahir"
													disabled={isLoading}
													id="tanggal_lahir"
												/>
											)}
										/>
									</div>
									{/* Jenis Kelamin */}
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-1">
											Jenis Kelamin
										</label>
										<select
											id="jenis_kelamin"
											{...register("jenis_kelamin")}
											className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm bg-white">
											<option value="">Pilih jenis kelamin</option>
											<option value="laki-laki">Laki-laki</option>
											<option value="perempuan">Perempuan</option>
										</select>
									</div>

									{/* Address */}
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-1">
											Alamat
										</label>
										<div className="relative">
											<MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
											<textarea
												id="alamat"
												{...register("alamat")}
												rows={3}
												className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none text-sm"
												placeholder="Masukkan alamat lengkap"
											/>
										</div>
									</div>
								</div>
							</div>

							{/* Right Column - Organization Information */}
							<div>
								<div className="flex items-center mb-4">
									<Building2 className="w-5 h-5 text-purple-500 mr-2" />
									<h3 className="text-lg font-bold text-gray-900">
										Informasi Organisasi
									</h3>
								</div>

								<div className="space-y-4">
									{/* Organization Name */}
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-1">
											Nama Organisasi <span className="text-red-500">*</span>
										</label>
										<div className="relative">
											<Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
											<input
												id="organization_nama"
												{...register("organization_nama")}
												type="text"
												className={`w-full pl-9 pr-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-sm ${
													errors.organization_nama
														? "border-red-500"
														: "border-gray-300"
												}`}
												placeholder="Masukkan nama organisasi"
											/>
										</div>
										{errors.organization_nama && (
											<p className="mt-1 text-xs text-red-600">
												{errors.organization_nama}
											</p>
										)}
									</div>

									{/* Organization Description */}
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-1">
											Deskripsi Organisasi
										</label>
										<div className="relative">
											<FileText className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
											<textarea
												id="organization_deskripsi"
												{...register("organization_deskripsi")}
												rows={3}
												className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none text-sm"
												placeholder="Deskripsikan organisasi Anda..."
											/>
										</div>
									</div>

									{/* Organization Phone */}
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-1">
											Telepon Organisasi
										</label>
										<div className="relative">
											<Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
											<input
												id="organization_telepon"
												{...register("organization_telepon")}
												type="tel"
												className={`w-full pl-9 pr-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-sm ${
													errors.organization_telepon
														? "border-red-500"
														: "border-gray-300"
												}`}
												placeholder="Masukkan nomor telepon organisasi"
											/>
										</div>
										{errors.organization_telepon && (
											<p className="mt-1 text-xs text-red-600">
												{errors.organization_telepon}
											</p>
										)}
									</div>

									{/* Organization Website */}
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-1">
											Website / Company Profile
										</label>
										<div className="relative">
											<Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
											<input
												id="organization_website"
												{...register("organization_website")}
												type="url"
												className={`w-full pl-9 pr-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-sm ${
													errors.organization_website
														? "border-red-500"
														: "border-gray-300"
												}`}
												placeholder="Diawali dengan https://"
											/>
										</div>
										{errors.organization_website && (
											<p className="mt-1 text-xs text-red-600">
												{errors.organization_website}
											</p>
										)}
									</div>
								</div>
							</div>
						</div>

						{/* Action Buttons - Fixed at bottom */}
						<div className="border-t border-gray-100 mt-6 pt-4 flex justify-end space-x-3">
							<Button
								type="button"
								variant="outline"
								onClick={() => navigate("/organization/profile")}
								disabled={isLoading}
								size="sm">
								Batal
							</Button>
							<Button
								type="submit"
								variant="success"
								loading={isLoading}
								disabled={isLoading}
								size="sm"
								className="min-w-[100px]">
								<Save className="w-4 h-4 mr-2" />
								Simpan
							</Button>
						</div>
					</Card>
				</motion.div>
			</form>
		</motion.div>
	);
}
