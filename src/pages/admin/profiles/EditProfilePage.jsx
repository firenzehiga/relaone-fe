import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUpdateUserMutation, useUserProfile } from "@/_hooks/useUsers";
import {
	getImageUrl,
	parseSkillsArray,
	addSkill,
	updateSkill,
	removeSkill,
} from "@/utils";
import { toInputDate } from "@/utils/dateFormatter";
import { useAuthStore } from "@/_hooks/useAuth";
import { motion } from "framer-motion";
import {
	User,
	Mail,
	Phone,
	MapPin,
	Save,
	ArrowLeft,
	FileText,
	Award,
	UserCircle2,
} from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/DynamicButton";
import { DatePicker } from "@/components/ui/date-picker";
import toast from "react-hot-toast";
import CustomSkeleton from "@/components/ui/CustomSkeleton";
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
export default function AdminEditProfilePage() {
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
			keahlian: [],
			foto_profil: null,
		},
	});

	const [imagePreview, setImagePreview] = useState(null);
	const [keahlianInput, setKeahlianInput] = useState("");
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
		if (getValues("nama")) return; // don't overwrite user edits
		reset({
			nama: profileData.nama || "",
			email: profileData.email || "",
			telepon: profileData.telepon || "",
			alamat: profileData.alamat || "",
			tanggal_lahir: toInputDate(profileData.tanggal_lahir) || "",
			jenis_kelamin: profileData.jenis_kelamin || "",
			bio: profileData.bio || "",
			keahlian: parseSkillsArray(profileData.keahlian) || [],
			foto_profil: profileData.foto_profil || null,
		});

		if (profileData.foto_profil) {
			setImagePreview(getImageUrl(`foto_profil/${profileData.foto_profil}`));
		}
	}, [profileData]);

	const foto = watch("foto_profil");
	const keahlian = watch("keahlian") || [];

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

	const handleFileChange = (e) => {
		const file = e.target.files && e.target.files[0];
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
		setValue("foto_profil", file, { shouldDirty: true });
	};

	const addKeahlianHandler = () => {
		const trimmed = keahlianInput.trim();
		if (!trimmed) return;
		const current = getValues("keahlian") || [];
		const newSkills = addSkill(current, trimmed);
		if (newSkills.length === current.length) {
			toast.error("Keahlian sudah ada atau tidak valid");
			return;
		}
		setValue("keahlian", newSkills, { shouldDirty: true });
		setKeahlianInput("");
	};

	const updateKeahlianHandler = (idx, value) => {
		const current = getValues("keahlian") || [];
		const updated = updateSkill(current, idx, value);
		setValue("keahlian", updated, { shouldDirty: true });
	};

	const removeKeahlianHandler = (idx) => {
		const current = getValues("keahlian") || [];
		const updated = removeSkill(current, idx);
		setValue("keahlian", updated, { shouldDirty: true });
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
			} else if (Array.isArray(val)) {
				payload.append(key, JSON.stringify(val));
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
				<Button onClick={() => navigate("/admin/profile")} variant="primary">
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
						Edit Profile
					</h1>
					<p className="text-gray-600 text-sm">
						Perbarui informasi profile Anda
					</p>
				</div>
				<Button
					variant="outline"
					onClick={() => navigate("/admin/profile")}
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
							<div className="flex items-center justify-between">
								<div className="flex-1">
									<div className="flex items-center mb-4">
										<UserCircle2 className="w-5 h-5 text-blue-500 mr-2" />
										<h3 className="text-lg font-bold text-gray-900">
											Foto Profil
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
							</div>
						</div>

						<div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
							{/* Left Column - Basic Information */}
							<div>
								<div className="flex items-center mb-4">
									<User className="w-5 h-5 text-blue-500 mr-2" />
									<h3 className="text-lg font-bold text-gray-900">
										Informasi Dasar
									</h3>
								</div>

								<div className="space-y-4">
									{/* Nama */}
									<div>
										<label
											htmlFor="nama"
											className="block text-sm font-medium text-gray-700 mb-1">
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
										<label
											htmlFor="email"
											className="block text-sm font-medium text-gray-700 mb-1">
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
										<label
											htmlFor="telepon"
											className="block text-sm font-medium text-gray-700 mb-1">
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
										<label
											htmlFor="jenis_kelamin"
											className="block text-sm font-medium text-gray-700 mb-1">
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
										<label
											htmlFor="alamat"
											className="block text-sm font-medium text-gray-700 mb-1">
											Alamat
										</label>
										<div className="relative">
											<MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
											<textarea
												id="alamat"
												{...register("alamat")}
												rows={3}
												className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none text-sm"
												placeholder="Masukkan alamat lengkap"
											/>
										</div>
									</div>
								</div>
							</div>

							{/* Right Column - Additional Information */}
							<div>
								<div className="flex items-center mb-4">
									<Award className="w-5 h-5 text-purple-500 mr-2" />
									<h3 className="text-lg font-bold text-gray-900">
										Informasi Tambahan
									</h3>
								</div>

								<div className="space-y-4">
									{/* Bio */}
									<div>
										<label
											htmlFor="bio"
											className="block text-sm font-medium text-gray-700 mb-1">
											Bio
										</label>
										<div className="relative">
											<FileText className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
											<textarea
												id="bio"
												{...register("bio")}
												rows={3}
												className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none text-sm"
												placeholder="Ceritakan tentang diri Anda..."
											/>
										</div>
									</div>
									{/* Keahlian (Skills) */}
									<div>
										<label
											htmlFor="keahlian_input"
											className="block text-sm font-medium text-gray-700">
											Keahlian
										</label>
										<div className="mt-2 space-y-2">
											{keahlian && keahlian.length > 0 ? (
												keahlian.map((p, idx) => (
													<div key={idx} className="flex items-center gap-2">
														<input
															type="text"
															className="flex-1 rounded-md border border-gray-200 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
															value={p}
															onChange={(e) =>
																updateKeahlianHandler(idx, e.target.value)
															}
														/>
														<button
															type="button"
															onClick={() => removeKeahlianHandler(idx)}
															className="px-2 py-1 text-sm text-red-600 bg-red-50 rounded">
															Hapus
														</button>
													</div>
												))
											) : (
												<div className="text-sm text-gray-400">
													Belum ada keahlian. Tambahkan di bawah.
												</div>
											)}

											<div className="flex items-center gap-2">
												<input
													id="keahlian_input"
													type="text"
													placeholder="Tambahkan keahlian, misal: Minimal lulusan SMA"
													className="flex-1 rounded-md border border-gray-200 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
													value={keahlianInput}
													onChange={(e) => setKeahlianInput(e.target.value)}
													onKeyDown={(e) => {
														if (e.key === "Enter") {
															e.preventDefault();
															addKeahlianHandler();
														}
													}}
												/>
												<Button
													variant="success"
													type="button"
													onClick={addKeahlianHandler}>
													Tambah
												</Button>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>

						{/* Action Buttons - Fixed at bottom */}
						<div className="border-t border-gray-100 mt-6 pt-4 flex justify-end space-x-3">
							<Button
								type="button"
								variant="outline"
								onClick={() => navigate("/admin/profile")}
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
