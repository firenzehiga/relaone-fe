import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Link, useSearchParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
	Eye,
	EyeOff,
	Mail,
	Lock,
	User,
	ArrowLeft,
	Phone,
	Calendar,
	Users,
	Building2,
	ChevronRight,
	ChevronLeft,
	Globe,
	MapPin,
} from "lucide-react";
import { useRegister, useAuthStore } from "@/_hooks/useAuth";
import { useDocumentTitle } from "@/_hooks/utils/useDocumentTitle";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import DynamicButton from "@/components/ui/DynamicButton";
import { RegisterIllustration } from "@/components/common/Illustration";

export default function RegisterPage() {
	const [searchParams] = useSearchParams();
	const registrationType = searchParams.get("type");
	const isOrganizationRegistration = registrationType === "organization";

	useDocumentTitle(isOrganizationRegistration ? "Daftar Organisasi" : "Daftar Akun");

	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [currentStep, setCurrentStep] = useState(1);

	const {
		register,
		handleSubmit,
		watch,
		getValues,
		trigger,
		control,
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
			role: isOrganizationRegistration ? "organization" : "volunteer",
			organization_nama: "",
			organization_alamat: "",
			organization_telepon: "",
			organization_deskripsi: "",
			organization_website: "",
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
			payload.organization_alamat = data.organization_alamat || "";
			payload.organization_telepon = data.organization_telepon || "";
			payload.organization_deskripsi = data.organization_deskripsi || "";
			payload.organization_website = data.organization_website || "";
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

	// Step navigation handlers
	const handleNextStep = async () => {
		if (currentStep === 1) {
			// Validate step 1 fields
			const isValid = await trigger([
				"nama",
				"email",
				"password",
				"password_confirmation",
				"telepon",
				"alamat",
			]);
			if (isValid) {
				setCurrentStep(2);
				window.scrollTo({ top: 0, behavior: "smooth" });
			}
		}
	};

	const handlePrevStep = () => {
		if (currentStep > 1) {
			setCurrentStep(currentStep - 1);
			window.scrollTo({ top: 0, behavior: "smooth" });
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
					<div className="w-full max-w-lg">
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
							{isOrganizationRegistration && (
								<p className="text-gray-600 mt-2">Registrasi Organisasi</p>
							)}
						</motion.div>

						{/* Progress Bar - Only for Organization Registration */}
						{isOrganizationRegistration && (
							<div className="mb-8">
								<div className="flex items-center justify-between mb-3">
									<div className="flex items-center space-x-2">
										<div
											className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
												currentStep >= 1 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
											}`}>
											1
										</div>
										<span
											className={`text-sm font-medium ${
												currentStep >= 1 ? "text-blue-600" : "text-gray-500"
											}`}>
											Informasi Akun
										</span>
									</div>
									<div className="flex-1 mx-4 h-1 bg-gray-200 rounded">
										<div
											className={`h-full rounded transition-all duration-300 ${
												currentStep >= 2 ? "bg-blue-600 w-full" : "bg-gray-200 w-0"
											}`}></div>
									</div>
									<div className="flex items-center space-x-2">
										<div
											className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
												currentStep >= 2 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
											}`}>
											2
										</div>
										<span
											className={`text-sm font-medium ${
												currentStep >= 2 ? "text-blue-600" : "text-gray-500"
											}`}>
											Informasi Organisasi
										</span>
									</div>
								</div>
							</div>
						)}

						{/* Register Form */}
						<motion.form
							// initial={{ y: 20, opacity: 0 }}
							// animate={{ y: 0, opacity: 1 }}
							// transition={{ delay: 0.4, duration: 0.5 }}
							onSubmit={handleSubmit(onSubmit)}
							className="space-y-6">
							{/* Step 1: Personal Data - Show for volunteers OR org step 1 */}
							{(!isOrganizationRegistration || currentStep === 1) && (
								<>
									{/* Use grid for main fields to reduce vertical length on larger screens */}
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										{/* Full Name */}
										<div className="md:col-span-2">
											<label
												htmlFor="nama"
												className="block text-sm font-medium text-gray-700 mb-1">
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
											<label
												htmlFor="email"
												className="block text-sm font-medium text-gray-700 mb-1">
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
											<label
												htmlFor="telepon"
												className="block text-sm font-medium text-gray-700 mb-1">
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
											{" "}
											<label
												htmlFor="tanggal_lahir"
												className="block text-sm font-medium text-gray-700 mb-1">
												Tanggal Lahir
											</label>{" "}
											<Controller
												control={control}
												name="tanggal_lahir"
												render={({ field }) => (
													<DatePicker
														value={field.value ? new Date(field.value) : null}
														onChange={(date) => {
															if (date) {
																const year = date.getFullYear();
																const month = String(date.getMonth() + 1).padStart(2, "0");
																const day = String(date.getDate()).padStart(2, "0");
																field.onChange(`${year}-${month}-${day}`);
															} else {
																field.onChange(null);
															}
														}}
														placeholder="Pilih tanggal lahir"
														disabled={isLoading}
														id="tanggal_lahir"
														buttonClassName=" py-6 text-gray-500"
													/>
												)}
											/>
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
												<Controller
													control={control}
													name="jenis_kelamin"
													render={({ field }) => (
														<Select
															onValueChange={(val) => field.onChange(val)}
															value={field.value || ""}
															disabled={isLoading}>
															<SelectTrigger className="w-full pl-10 py-6 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-50 disabled:cursor-not-allowed">
																<SelectValue placeholder="Pilih Jenis Kelamin" />
															</SelectTrigger>
															<SelectContent>
																<SelectItem value="laki-laki">Laki-Laki</SelectItem>
																<SelectItem value="perempuan">Perempuan</SelectItem>
															</SelectContent>
														</Select>
													)}
												/>
											</div>
										</div>
										{/* Address (span full) */}
										<div className="md:col-span-2">
											<label
												htmlFor="alamat"
												className="block text-sm font-medium text-gray-700 mb-1">
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
													{showPassword ? (
														<EyeOff className="w-5 h-5" />
													) : (
														<Eye className="w-5 h-5" />
													)}
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
														validate: (v) =>
															v === getValues("password") || "Passwords do not match",
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

									{/* Terms Agreement - Only on Step 1 for organization or always for volunteer */}
									{!isOrganizationRegistration && (
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
									)}

									{/* Next Step Button - Only for organization on step 1 */}
									{isOrganizationRegistration && currentStep === 1 && (
										<DynamicButton
											type="button"
											onClick={handleNextStep}
											disabled={isLoading || !isValid}
											className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2">
											Selanjutnya
											<ChevronRight className="w-5 h-5" />
										</DynamicButton>
									)}
								</>
							)}

							{/* Step 2: Organization Information - Only for organization registration */}
							{isOrganizationRegistration && currentStep === 2 && (
								<>
									<div className="space-y-4">
										{/* Organization Name */}
										<div>
											<label
												htmlFor="organization_nama"
												className="block text-sm font-medium text-gray-700 mb-1">
												Nama Organisasi <span className="text-red-500">*</span>
											</label>
											<div className="relative">
												<Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
												<input
													type="text"
													id="organization_nama"
													{...register("organization_nama", {
														validate: (v) =>
															watchRole !== "organization" ||
															(v && v.trim() !== "") ||
															"Organization name is required.",
													})}
													className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
													placeholder="Nama organisasi Anda"
													disabled={isLoading}
												/>
												{isSubmitted && errors.organization_nama && (
													<p className="mt-1 text-sm text-red-600">
														{errors.organization_nama.message}
													</p>
												)}
											</div>
										</div>

										{/* Organization Address */}
										<div>
											<label
												htmlFor="organization_alamat"
												className="block text-sm font-medium text-gray-700 mb-1">
												Alamat Organisasi
											</label>
											<div className="relative">
												<MapPin className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
												<textarea
													id="organization_alamat"
													{...register("organization_alamat")}
													className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
													placeholder="Alamat lengkap organisasi"
													disabled={isLoading}
													rows={3}
												/>
											</div>
										</div>

										{/* Organization Phone */}
										<div>
											<label
												htmlFor="organization_telepon"
												className="block text-sm font-medium text-gray-700 mb-1">
												Telepon Organisasi
											</label>
											<div className="relative">
												<Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
												<input
													type="tel"
													id="organization_telepon"
													{...register("organization_telepon")}
													className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
													placeholder="Nomor telepon organisasi"
													disabled={isLoading}
												/>
											</div>
										</div>

										{/* Organization Description */}
										<div>
											<label
												htmlFor="organization_deskripsi"
												className="block text-sm font-medium text-gray-700 mb-1">
												Deskripsi Organisasi
											</label>
											<textarea
												id="organization_deskripsi"
												{...register("organization_deskripsi")}
												className="w-full pl-3 pr-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
												placeholder="Deskripsi singkat tentang organisasi Anda"
												disabled={isLoading}
												rows={4}
											/>
										</div>

										{/* Organization Website */}
										<div>
											<label
												htmlFor="organization_website"
												className="block text-sm font-medium text-gray-700 mb-1">
												Website Organisasi
											</label>
											<div className="relative">
												<Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
												<input
													type="url"
													id="organization_website"
													{...register("organization_website")}
													className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
													placeholder="https://www.example.com"
													disabled={isLoading}
												/>
											</div>
										</div>
									</div>

									{/* Terms Agreement - On Step 2 for organization */}
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

									{/* Navigation Buttons - Step 2 for organization */}
									<div className="flex gap-3">
										<DynamicButton
											type="button"
											onClick={handlePrevStep}
											disabled={isLoading}
											className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
											<ChevronLeft className="w-5 h-5" />
											Kembali
										</DynamicButton>
										<DynamicButton
											type="submit"
											variant="success"
											disabled={isLoading || isSubmitting || !isValid}
											className="flex-1 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white py-3 rounded-lg font-medium transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
											{isLoading ? (
												<div className="flex items-center justify-center space-x-2">
													<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
													<span>Membuat Akun...</span>
												</div>
											) : (
												"Buat Akun"
											)}
										</DynamicButton>
									</div>
								</>
							)}

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

							{/* Submit Button - Only for volunteer registration (not organization) */}
							{!isOrganizationRegistration && (
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
							)}
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
						{/* CTA Banner - Organization Registration (only show on volunteer registration) */}
						{!isOrganizationRegistration && (
							<motion.div
								initial={{ y: 20, opacity: 0 }}
								animate={{ y: 0, opacity: 1 }}
								transition={{ delay: 0.7, duration: 0.5 }}
								className="mt-6">
								<Link
									to="/register?type=organization"
									className="block p-4 bg-gradient-to-r from-blue-600 via-blue-600 to-blue-600 hover:from-blue-700 hover:to-blue-700 rounded-lg transition-all transform hover:scale-[1.02] shadow-md">
									<div className="flex items-center justify-between text-white">
										<div className="flex items-center gap-3">
											<div className="p-2 bg-white/20 rounded-lg">
												<Building2 className="w-5 h-5" />
											</div>
											<div>
												<p className="font-semibold">Bagian Dari Organisasi?</p>
												<p className="text-sm text-white/90">
													Daftarkan dan mari ciptakan dampak positif bersama kami!
												</p>
											</div>
										</div>
										<ArrowLeft className="w-5 h-5 rotate-180" />
									</div>
								</Link>
							</motion.div>
						)}
					</div>
				</div>
			</div>
		</AnimatePresence>
	);
}
