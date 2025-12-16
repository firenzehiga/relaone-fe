import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
	Eye,
	EyeOff,
	Mail,
	Lock,
	User,
	ArrowLeft,
	Heart,
	UserSearch,
	HouseHeart,
	Phone,
	Calendar,
	Users,
} from "lucide-react";
import { useRegister, useAuthStore } from "@/_hooks/useAuth";
import { useDocumentTitle } from "@/_hooks/useDocumentTitle";

import DynamicButton from "@/components/ui/Button";
import { RegisterIllustration } from "@/components/common/Illustration";

export default function RegisterPage() {
	useDocumentTitle("Register Page");

	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const {
		register,
		handleSubmit,
		watch,
		getValues,
		formState: { errors, isSubmitting, isSubmitted, isValid },
	} = useForm({
		defaultValues: {
			nama: "",
			email: "",
			password: "",
			password_confirmation: "",
			telepon: "",
			tanggal_lahir: "",
			jenis_kelamin: "",
			alamat: "",
			role: "volunteer",
			organization_nama: "",
			organization_deskripsi: "",
			agreeToTerms: false,
		},
		mode: "onChange",
		reValidateMode: "onChange",
	});
	const watchRole = watch("role");

	const registerMutation = useRegister();
	const { isLoading } = useAuthStore();

	const [apiErrors, setApiErrors] = useState(null);

	const onSubmit = async (data) => {
		// data comes from react-hook-form
		// prepare payload similar to previous behavior
		const payload = {
			nama: data.nama,
			email: data.email,
			password: data.password,
			password_confirmation: data.password_confirmation,
			telepon: data.telepon || null,
			tanggal_lahir: data.tanggal_lahir || null,
			jenis_kelamin: data.jenis_kelamin || null,
			alamat: data.alamat || null,
			role: data.role,
		};

		if (data.role === "organization") {
			payload.organization_nama = data.organization_nama || "";
			payload.organization_deskripsi = data.organization_deskripsi || "";
		}

		setApiErrors(null);
		try {
			await registerMutation.mutateAsync(payload);
			setApiErrors(null);
		} catch (error) {
			console.log(error?.errors);
			const msg = error?.errors || "Registrasi gagal";
			setApiErrors({ general: [String(msg)] });
		}
	};
	return (
		<AnimatePresence mode="wait">
			<div className="min-h-screen flex">
				{/* Left Side - Illustration */}
				<RegisterIllustration />
				{/* Right Side - Register Form */}
				<div
					initial={{ opacity: 0, x: 50 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.6 }}
					className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white overflow-y-auto">
					<div className="w-full max-w-md">
						{/* Back Button */}
						<Link
							to="/login"
							className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-8 transition-colors">
							<ArrowLeft className="w-4 h-4 mr-2" />
							Kembali ke Login
						</Link>

						{/* Header */}
						<motion.div
							initial={{ y: 20, opacity: 0 }}
							animate={{ y: 0, opacity: 1 }}
							transition={{ delay: 0.2, duration: 0.5 }}
							className="mb-8">
							<h2 className="text-3xl font-bold text-gray-900">Buat Akun</h2>
						</motion.div>

						{/* Register Form */}
						<motion.form
							// initial={{ y: 20, opacity: 0 }}
							// animate={{ y: 0, opacity: 1 }}
							// transition={{ delay: 0.4, duration: 0.5 }}
							onSubmit={handleSubmit(onSubmit)}
							className="space-y-6">
							{/* Use grid for main fields to reduce vertical length on larger screens */}
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								{/* Full Name */}
								<div className="md:col-span-2">
									<label htmlFor="nama" className="block text-sm font-medium text-gray-700 mb-1">
										Nama Lengkap <span className="text-red-500">*</span>
									</label>
									<div className="relative">
										<User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
										<input
											type="text"
											id="nama"
											{...register("nama", { required: "Full name is required" })}
											className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
											placeholder="John Doe"
											disabled={isLoading}
										/>
										{isSubmitted && errors.nama && (
											<p className="mt-1 text-sm text-red-600">{errors.nama.message}</p>
										)}
									</div>
								</div>

								{/* Email */}
								<div>
									<label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
										Email Aktif <span className="text-red-500">*</span>
									</label>
									<div className="relative">
										<Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
										<input
											type="email"
											id="email"
											{...register("email", {
												required: "Email wajib diisi",
												pattern: { value: /^\S+@\S+$/i, message: "Format email tidak valid" },
											})}
											className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
											placeholder="your@example.com"
											disabled={isLoading}
										/>
										{isSubmitted && errors.email && (
											<p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
										)}
									</div>
								</div>
								{/* Phone */}
								<div>
									<label htmlFor="telepon" className="block text-sm font-medium text-gray-700 mb-1">
										Nomor Telepon/Whatsapp <span className="text-red-500">*</span>
									</label>
									<div className="relative">
										<Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
										<input
											type="tel"
											id="telepon"
											{...register("telepon")}
											className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
											placeholder="081xxxxxxxxx"
											disabled={isLoading}
										/>
									</div>
								</div>

								{/* Date of Birth */}
								<div>
									<label
										htmlFor="tanggal_lahir"
										className="block text-sm font-medium text-gray-700 mb-1">
										Tanggal Lahir
									</label>
									<div className="relative">
										<Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
										<input
											type="date"
											id="tanggal_lahir"
											{...register("tanggal_lahir")}
											className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
											disabled={isLoading}
										/>
									</div>
								</div>
								{/* Gender Field */}
								<div>
									<label
										htmlFor="jenis_kelamin"
										className="block text-sm font-medium text-gray-700 mb-1">
										Jenis Kelamin
									</label>
									<div className="relative">
										<Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
										<select
											id="jenis_kelamin"
											{...register("jenis_kelamin")}
											className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none disabled:bg-gray-50 disabled:cursor-not-allowed"
											disabled={isLoading}>
											<option value="">Select Gender</option>
											<option value="laki-laki">Laki-Laki</option>
											<option value="perempuan">Perempuan</option>
										</select>
									</div>
								</div>
								{/* Address (span full) */}
								<div className="md:col-span-2">
									<label htmlFor="alamat" className="block text-sm font-medium text-gray-700 mb-1">
										Alamat <span className="text-red-500">*</span>
									</label>
									<div className="relative">
										<textarea
											id="alamat"
											{...register("alamat", { required: "Address is required" })}
											placeholder="Alamat lengkap"
											className="w-full pl-3 pr-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
											disabled={isLoading}
										/>
										{isSubmitted && errors.alamat && (
											<p className="mt-1 text-sm text-red-600">{errors.alamat.message}</p>
										)}
									</div>
								</div>

								{/* Role (grouped radios for accessibility) */}
								<div className="md:col-span-2">
									<fieldset className="space-y-2">
										<legend className="block text-sm font-medium text-gray-700 mb-1">
											Bergabung sebagai <span className="text-red-500">*</span>
										</legend>

										<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
											{/* Volunteer option (input as sibling to label so peer styling works) */}
											<div>
												<input
													type="radio"
													id="volunteer-option"
													value="volunteer"
													{...register("role", { required: true })}
													className="hidden peer"
													disabled={isLoading}
												/>
												<label
													htmlFor="volunteer-option"
													className="inline-flex items-center justify-between w-3/4 p-2 text-gray-500 bg-white border-2 border-gray-200 rounded-full cursor-pointer peer-checked:border-sky-500 hover:text-gray-600 peer-checked:text-gray-600 hover:bg-gray-50">
													<div className="flex items-center gap-3">
														<div className="flex items-center gap-3">
															<UserSearch className="w-7 h-7 text-sky-500" />
															<div className="w-full text-lg font-semibold">Relawan</div>
														</div>
													</div>
												</label>
											</div>

											{/* Organization option */}
											<div>
												<input
													type="radio"
													id="organization-option"
													value="organization"
													{...register("role", { required: true })}
													className="hidden peer"
													disabled={isLoading}
												/>
												<label
													htmlFor="organization-option"
													className="inline-flex items-center justify-between w-3/4 p-2 text-gray-500 bg-white border-2 border-gray-200 rounded-full cursor-pointer peer-checked:border-sky-500 hover:text-gray-600 peer-checked:text-gray-600 hover:bg-gray-50">
													<div className="flex items-center gap-3">
														<HouseHeart className="w-7 h-7 text-sky-500" />
														<div className="w-full text-lg font-semibold">Organisasi</div>
													</div>
												</label>
											</div>
										</div>
									</fieldset>
								</div>

								{/* Password */}
								<div>
									<label
										htmlFor="password"
										className="block text-sm font-medium text-gray-700 mb-1">
										Password <span className="text-red-500">*</span>
									</label>
									<div className="relative">
										<Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
										<input
											type={showPassword ? "text" : "password"}
											id="password"
											{...register("password", {
												required: "Password wajib diisi",
												minLength: { value: 8, message: "Password minimal 8 karakter" },
											})}
											className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
											placeholder="••••••••"
											disabled={isLoading}
										/>
										{isSubmitted && errors.password && (
											<p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
										)}
										<button
											type="button"
											onClick={() => setShowPassword(!showPassword)}
											disabled={isLoading}
											className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:cursor-not-allowed">
											{showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
										</button>
									</div>
								</div>

								{/* Confirm Password */}
								<div>
									<label
										htmlFor="password_confirmation"
										className="block text-sm font-medium text-gray-700 mb-1">
										Konfirmasi Password <span className="text-red-500">*</span>
									</label>
									<div className="relative">
										<Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
										<input
											type={showConfirmPassword ? "text" : "password"}
											id="password_confirmation"
											{...register("password_confirmation", {
												required: "Confirm password is required",
												validate: (v) => v === getValues("password") || "Passwords do not match",
											})}
											className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
											placeholder="••••••••"
											disabled={isLoading}
										/>
										{isSubmitted && errors.password_confirmation && (
											<p className="mt-1 text-sm text-red-600">
												{errors.password_confirmation.message}
											</p>
										)}
										<button
											type="button"
											onClick={() => setShowConfirmPassword(!showConfirmPassword)}
											disabled={isLoading}
											className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:cursor-not-allowed">
											{showConfirmPassword ? (
												<EyeOff className="w-5 h-5" />
											) : (
												<Eye className="w-5 h-5" />
											)}
										</button>
									</div>
									{/* password confirmation handled by react-hook-form validation */}
								</div>
							</div>
							{/* Organization-specific fields (shown only when role === 'organization') */}
							{watchRole === "organization" && (
								<div className="mt-2">
									<details className="bg-gray-50 border border-gray-100 rounded-lg p-3">
										<summary className="cursor-pointer font-medium">
											More info (Organization Details)
										</summary>
										<div className="mt-4">
											<div className="border border-gray-100 rounded-lg p-3 bg-white shadow-sm">
												<div className="space-y-3">
													<div>
														<label
															htmlFor="organization_nama"
															className="block text-sm font-medium text-gray-700 mb-1">
															Nama Organisasi<span className="text-red-500">*</span>
														</label>
														<input
															type="text"
															id="organization_nama"
															{...register("organization_nama", {
																validate: (v) =>
																	watchRole !== "organization" ||
																	(v && v.trim() !== "") ||
																	"Organization name is required.",
															})}
															className="w-full pl-3 pr-4 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
															placeholder="Your organization name"
															disabled={isLoading}
														/>
														{isSubmitted && errors.organization_nama && (
															<p className="mt-1 text-sm text-red-600">
																{errors.organization_nama.message}
															</p>
														)}
													</div>

													<div>
														<label
															htmlFor="organization_deskripsi"
															className="block text-sm font-medium text-gray-700 mb-1">
															Deskripsi Organisasi <span className="text-red-500">*</span>
														</label>
														<textarea
															id="organization_deskripsi"
															{...register("organization_deskripsi")}
															className="w-full pl-3 pr-4 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
															placeholder="A short description"
															disabled={isLoading}
															rows={2}
														/>
													</div>
												</div>
											</div>
										</div>
									</details>
								</div>
							)}
							{/* Collapsible more-info for optional fields */}
							{/* API / validation errors */}
							{apiErrors && (
								<div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded">
									{apiErrors.general && (
										<p>
											{apiErrors.general.join ? apiErrors.general.join(", ") : apiErrors.general}
										</p>
									)}
									{Object.keys(apiErrors)
										.filter((k) => k !== "general")
										.map((k) => (
											<p key={k} className="text-sm">
												{k}: {apiErrors[k].join ? apiErrors[k].join(" ") : apiErrors[k]}
											</p>
										))}
								</div>
							)}

							{/* Terms Agreement */}
							<div className="flex items-start">
								<input
									type="checkbox"
									id="agreeToTerms"
									{...register("agreeToTerms", { required: true })}
									disabled={isLoading}
									className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:cursor-not-allowed"
								/>
								<label htmlFor="agreeToTerms" className="ml-2 text-sm text-gray-600">
									Saya menyetujui{" "}
									<Link
										to="/terms-of-service"
										target="_blank"
										className="text-blue-600 hover:text-blue-800">
										Syarat dan Ketentuan
									</Link>{" "}
									dan{" "}
									<Link
										to="/privacy-policy"
										target="_blank"
										className="text-blue-600 hover:text-blue-800">
										Kebijakan Privasi
									</Link>
								</label>
							</div>

							{/* Submit Button */}
							<DynamicButton
								type="submit"
								variant="success"
								disabled={isLoading || isSubmitting || !isValid}
								className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white py-3 rounded-lg font-medium transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
								{isLoading ? (
									<div className="flex items-center justify-center space-x-2">
										<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
										<span>Membuat Akun...</span>
									</div>
								) : (
									"Buat Akun"
								)}
							</DynamicButton>
						</motion.form>

						{/* Sign In Link */}
						<motion.p
							initial={{ y: 20, opacity: 0 }}
							animate={{ y: 0, opacity: 1 }}
							transition={{ delay: 0.6, duration: 0.5 }}
							className="text-center text-gray-600 mt-8">
							Sudah punya akun?{" "}
							<Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium">
								Login
							</Link>
						</motion.p>

						{/* Footer Text */}
						<motion.p
							initial={{ y: 20, opacity: 0 }}
							animate={{ y: 0, opacity: 1 }}
							transition={{ delay: 0.8, duration: 0.5 }}
							className="text-center text-gray-500 text-sm mt-4 flex items-center justify-center">
							Made with <Heart className="w-4 h-4 mx-1 text-red-500" /> for volunteers
						</motion.p>
					</div>
				</div>
			</div>
		</AnimatePresence>
	);
}
