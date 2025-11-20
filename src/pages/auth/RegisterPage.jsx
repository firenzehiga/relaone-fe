import { useState } from "react";
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
import DynamicButton from "@/components/ui/Button";
import { useRegister, useAuthStore } from "@/_hooks/useAuth";
import { RegisterIllustration } from "@/components/common/Illustration";

export default function RegisterPage() {
	const [formData, setFormData] = useState({
		nama: "",
		email: "",
		password: "",
		password_confirmation: "",
		telepon: "",
		tanggal_lahir: "",
		jenis_kelamin: "",
		alamat: "",
		role: "volunteer",
		// organization specific
		organization_nama: "",
		organization_deskripsi: "",
		agreeToTerms: false,
	});
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const registerMutation = useRegister();
	const { isLoading } = useAuthStore();
	const { error: storeError } = useAuthStore();

	const [submitAttempted, setSubmitAttempted] = useState(false);
	const [apiErrors, setApiErrors] = useState(null);

	const handleInputChange = (e) => {
		const { name, value, type, checked } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: type === "checkbox" ? checked : value,
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		// Basic validation
		setSubmitAttempted(true);

		if (
			!formData.nama ||
			!formData.email ||
			!formData.password ||
			!formData.password_confirmation
		) {
			return;
		}

		// If registering as organization, require organization_nama
		if (formData.role === "organization" && !formData.organization_nama) {
			return;
		}

		if (formData.password !== formData.password_confirmation) {
			return;
		}

		if (!formData.agreeToTerms) {
			return;
		}

		// Prepare data for API (remove confirm password and agreeToTerms)
		const payload = {
			nama: formData.nama,
			email: formData.email,
			password: formData.password,
			password_confirmation: formData.password_confirmation,
			telepon: formData.telepon || null,
			tanggal_lahir: formData.tanggal_lahir || null,
			jenis_kelamin: formData.jenis_kelamin || null,
			alamat: formData.alamat || null,
			role: formData.role,
		};

		// tambahkan field organisasi bila diperlukan
		if (formData.role === "organization") {
			payload.organization_nama = formData.organization_nama || "";
			payload.organization_deskripsi = formData.organization_deskripsi || "";
		}

		// Panggil mutation register pakai try/catch agar handling lebih sederhana
		setApiErrors(null); // bersihkan error lama
		try {
			await registerMutation.mutateAsync(payload);
			setApiErrors(null);
			// pesan sukses ditangani di mutation
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
							to="/"
							className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-8 transition-colors">
							<ArrowLeft className="w-4 h-4 mr-2" />
							Go Back
						</Link>

						{/* Header */}
						<motion.div
							initial={{ y: 20, opacity: 0 }}
							animate={{ y: 0, opacity: 1 }}
							transition={{ delay: 0.2, duration: 0.5 }}
							className="mb-8">
							<h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
						</motion.div>

						{/* Register Form */}
						<motion.form
							// initial={{ y: 20, opacity: 0 }}
							// animate={{ y: 0, opacity: 1 }}
							// transition={{ delay: 0.4, duration: 0.5 }}
							onSubmit={handleSubmit}
							className="space-y-6">
							{/* Use grid for main fields to reduce vertical length on larger screens */}
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								{/* Full Name */}
								<div className="md:col-span-2">
									<label htmlFor="nama" className="block text-sm font-medium text-gray-700 mb-1">
										Full Name <span className="text-red-500">*</span>
									</label>
									<div className="relative">
										<User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
										<input
											type="text"
											id="nama"
											name="nama"
											value={formData.nama}
											onChange={handleInputChange}
											className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
											placeholder="John Doe"
											disabled={isLoading}
											required
										/>
									</div>
								</div>

								{/* Email */}
								<div>
									<label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
										Email Address <span className="text-red-500">*</span>
									</label>
									<div className="relative">
										<Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
										<input
											type="email"
											id="email"
											name="email"
											value={formData.email}
											onChange={handleInputChange}
											className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
											placeholder="your@example.com"
											disabled={isLoading}
											required
										/>
									</div>
								</div>
								{/* Phone */}
								<div>
									<label htmlFor="telepon" className="block text-sm font-medium text-gray-700 mb-1">
										Phone Number <span className="text-red-500">*</span>
									</label>
									<div className="relative">
										<Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
										<input
											type="tel"
											id="telepon"
											name="telepon"
											value={formData.telepon}
											onChange={handleInputChange}
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
										Date of Birth
									</label>
									<div className="relative">
										<Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
										<input
											type="date"
											id="tanggal_lahir"
											name="tanggal_lahir"
											value={formData.tanggal_lahir}
											onChange={handleInputChange}
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
										Gender
									</label>
									<div className="relative">
										<Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
										<select
											id="jenis_kelamin"
											name="jenis_kelamin"
											value={formData.jenis_kelamin}
											onChange={handleInputChange}
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
										Address <span className="text-red-500">*</span>
									</label>
									<div className="relative">
										<textarea
											id="alamat"
											name="alamat"
											value={formData.alamat}
											onChange={handleInputChange}
											placeholder="Alamat lengkap"
											className="w-full pl-3 pr-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
											disabled={isLoading}
										/>
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
													name="role"
													value="volunteer"
													checked={formData.role === "volunteer"}
													onChange={handleInputChange}
													className="hidden peer"
													disabled={isLoading}
													required
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
													name="role"
													value="organization"
													checked={formData.role === "organization"}
													onChange={handleInputChange}
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
											name="password"
											value={formData.password}
											onChange={handleInputChange}
											className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
											placeholder="••••••••"
											disabled={isLoading}
											minLength={8}
											required
										/>
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
										Confirm Password <span className="text-red-500">*</span>
									</label>
									<div className="relative">
										<Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
										<input
											type={showConfirmPassword ? "text" : "password"}
											id="password_confirmation"
											name="password_confirmation"
											value={formData.password_confirmation}
											onChange={handleInputChange}
											className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
											placeholder="••••••••"
											disabled={isLoading}
											required
										/>
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
									{formData.password_confirmation &&
										formData.password !== formData.password_confirmation && (
											<p className="mt-1 text-sm text-red-600">Passwords do not match</p>
										)}
								</div>
							</div>
							{/* Organization-specific fields (shown only when role === 'organization') */}
							{formData.role === "organization" && (
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
															Organization Name <span className="text-red-500">*</span>
														</label>
														<input
															type="text"
															id="organization_nama"
															name="organization_nama"
															value={formData.organization_nama}
															onChange={handleInputChange}
															className="w-full pl-3 pr-4 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
															placeholder="Your organization name"
															disabled={isLoading}
														/>
														{submitAttempted && !formData.organization_nama && (
															<p className="mt-1 text-sm text-red-600">
																Organization name is required.
															</p>
														)}
													</div>

													<div>
														<label
															htmlFor="organization_deskripsi"
															className="block text-sm font-medium text-gray-700 mb-1">
															Organization Description <span className="text-red-500">*</span>
														</label>
														<textarea
															id="organization_deskripsi"
															name="organization_deskripsi"
															value={formData.organization_deskripsi}
															onChange={handleInputChange}
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
									name="agreeToTerms"
									checked={formData.agreeToTerms}
									onChange={handleInputChange}
									disabled={isLoading}
									className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:cursor-not-allowed"
									required
								/>
								<label htmlFor="agreeToTerms" className="ml-2 text-sm text-gray-600">
									I agree to the{" "}
									<Link
										to="/terms-of-service"
										target="_blank"
										className="text-blue-600 hover:text-blue-800">
										Terms of Service
									</Link>{" "}
									and{" "}
									<Link
										to="/privacy-policy"
										target="_blank"
										className="text-blue-600 hover:text-blue-800">
										Privacy Policy
									</Link>
								</label>
							</div>

							{/* Submit Button */}
							<DynamicButton
								type="submit"
								variant="success"
								disabled={
									isLoading ||
									!formData.nama ||
									!formData.email ||
									!formData.password ||
									!formData.password_confirmation ||
									formData.password !== formData.password_confirmation ||
									!formData.agreeToTerms
								}
								className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white py-3 rounded-lg font-medium transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
								{isLoading ? (
									<div className="flex items-center justify-center space-x-2">
										<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
										<span>Creating Account...</span>
									</div>
								) : (
									"Create Account"
								)}
							</DynamicButton>
						</motion.form>

						{/* Sign In Link */}
						<motion.p
							initial={{ y: 20, opacity: 0 }}
							animate={{ y: 0, opacity: 1 }}
							transition={{ delay: 0.6, duration: 0.5 }}
							className="text-center text-gray-600 mt-8">
							Already have an account?{" "}
							<Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium">
								Sign in
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
