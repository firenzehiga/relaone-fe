import { useState, useEffect } from "react";

import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { Lock, Eye, EyeOff, ArrowLeft, CheckCircle, AlertCircle, Mail, Shield } from "lucide-react";
import DynamicButton from "@/components/ui/DynamicButton";
import { useResetPassword, useAuthStore } from "@/_hooks/useAuth";
import { showToast } from "@/components/ui/Toast";
import { useDocumentTitle } from "@/_hooks/utils/useDocumentTitle";

export default function ResetPasswordPage() {
	useDocumentTitle("Reset Password");
	const navigate = useNavigate();

	const [searchParams] = useSearchParams();
	const [formData, setFormData] = useState({
		email: "",
		password: "",
		confirmPassword: "",
	});
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [token, setToken] = useState("");
	const [tokenValid, setTokenValid] = useState(true);
	const [tokenExpired, setTokenExpired] = useState(false);
	const [passwordStrength, setPasswordStrength] = useState("");
	const [shouldRender, setShouldRender] = useState(false);

	const resetPasswordMutation = useResetPassword();
	const { isLoading } = useAuthStore();

	// Validasi token format
	const isValidTokenFormat = (token) => {
		return token && token.length > 20; // Cek panjang token minimal
	};

	// Ambil token, email, expires, signature dari URL params
	useEffect(() => {
		const urlToken = searchParams.get("token");
		const urlEmail = searchParams.get("email");
		const urlExpires = searchParams.get("expires");
		const urlSignature = searchParams.get("signature");

		// 🔒 PROTEKSI: Redirect jika tidak ada token atau format invalid
		if (!urlToken || !isValidTokenFormat(urlToken)) {
			navigate("/login", { replace: true });
			return;
		}

		// 🔒 PROTEKSI: Redirect jika parameter tidak lengkap
		if (!urlEmail || !urlExpires || !urlSignature) {
			navigate("/login", { replace: true });
			return;
		}

		// 🔒 Validasi expires di frontend SEBELUM tampilkan form
		const expiresTimestamp = parseInt(urlExpires, 10);
		const currentTimestamp = Math.floor(Date.now() / 1000);

		if (!isNaN(expiresTimestamp) && currentTimestamp > expiresTimestamp) {
			setTokenExpired(true);
			setTokenValid(false);
			setShouldRender(true);
			return;
		}

		// Jika semua validasi lolos, set data
		setToken(urlToken);
		setTokenValid(true);
		setFormData((prev) => ({ ...prev, email: urlEmail }));
		setShouldRender(true);
	}, [searchParams, navigate]);

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));

		// Validasi kekuatan password secara real-time
		if (name === "password") {
			const strength = getPasswordStrength(value);
			setPasswordStrength(strength);
		}
	};

	const getPasswordStrength = (password) => {
		if (password.length === 0) return "";
		if (password.length < 8) return "weak";

		let score = 0;
		if (/[a-z]/.test(password)) score++;
		if (/[A-Z]/.test(password)) score++;
		if (/\d/.test(password)) score++;
		if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;

		if (score >= 4) return "very-strong";
		if (score >= 3) return "strong";
		if (score >= 2) return "medium";
		return "weak";
	};

	const getPasswordStrengthColor = (strength) => {
		switch (strength) {
			case "very-strong":
				return "text-green-600";
			case "strong":
				return "text-green-500";
			case "medium":
				return "text-yellow-500";
			case "weak":
				return "text-red-500";
			default:
				return "text-gray-400";
		}
	};

	const getPasswordStrengthText = (strength) => {
		switch (strength) {
			case "very-strong":
				return "Sangat Kuat";
			case "strong":
				return "Kuat";
			case "medium":
				return "Sedang";
			case "weak":
				return "Lemah";
			default:
				return "";
		}
	};

	const validatePassword = (password) => {
		const minLength = 8;
		const hasUpperCase = /[A-Z]/.test(password);
		const hasLowerCase = /[a-z]/.test(password);
		const hasNumbers = /\d/.test(password);

		if (password.length < minLength) {
			return "Password minimal 8 karakter";
		}
		if (!hasUpperCase || !hasLowerCase) {
			return "Password harus mengandung huruf besar dan kecil";
		}
		if (!hasNumbers) {
			return "Password harus mengandung angka";
		}
		return "";
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		// Basic validation
		if (!formData.email || !formData.password || !formData.confirmPassword) {
			showToast({
				type: "error",
				title: "Field Diperlukan",
				message: "Mohon isi semua field yang diperlukan",
				duration: 2000,
				position: "top-center",
			});
			return;
		}

		// Validasi password
		const passwordError = validatePassword(formData.password);
		if (passwordError) {
			showToast({
				type: "error",
				title: "Password Tidak Valid",
				message: passwordError,
				duration: 3000,
				position: "top-center",
			});
			return;
		}

		// Validasi konfirmasi password
		if (formData.password !== formData.confirmPassword) {
			showToast({
				type: "error",
				title: "Password Tidak Cocok",
				message: "Konfirmasi password tidak sesuai",
				duration: 2000,
				position: "top-center",
			});
			return;
		}

		// Panggil reset password mutation
		resetPasswordMutation.mutate(
			{
				token,
				email: formData.email,
				newPassword: formData.password,
				confirmPassword: formData.confirmPassword,
			},
			{
				onSuccess: () => {
					// Bersihkan data form untuk keamanan
					setFormData({
						email: "",
						password: "",
						confirmPassword: "",
					});
					setPasswordStrength("");
					// Token akan dibersihkan saat navigasi ke login
				},
			}
		);
	};

	// Jangan render apapun sampai validasi selesai
	if (!shouldRender) {
		return null;
	}

	// Token expired state
	if (tokenExpired) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
				<div className="max-w-lg w-full">
					<div className="bg-white rounded-xl shadow-xl overflow-hidden border-t-4 border-yellow-500 relative">
						<div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-bl-full"></div>
						<div className="absolute bottom-0 left-0 w-24 h-24 bg-yellow-500/5 rounded-tr-full"></div>

						<div className="px-8 py-12 text-center relative z-10">
							<div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
								<AlertCircle className="w-10 h-10 text-yellow-600" />
							</div>

							<h2 className="text-3xl font-bold text-gray-900 mb-4">Link Sudah Kadaluarsa</h2>
							<p className="text-gray-600 mb-2">
								Link reset password sudah kadaluarsa untuk alasan keamanan.
							</p>
							<p className="text-gray-500 text-sm mb-8">
								Link reset password hanya berlaku selama 60 menit. Silakan minta link baru untuk
								mengatur ulang password Anda.
							</p>

							<Link to="/forgot-password">
								<DynamicButton
									variant="success"
									className="w-full py-3 rounded-lg font-medium transition-all transform hover:scale-105">
									<Mail className="w-4 h-4 mr-2 inline" />
									Minta Link Baru
								</DynamicButton>
							</Link>
						</div>
					</div>
				</div>
			</div>
		);
	}

	// Invalid token state
	if (!tokenValid) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
				<div className="max-w-lg w-full">
					<div className="bg-white rounded-xl shadow-xl overflow-hidden border-t-4 border-red-500 relative">
						<div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-bl-full"></div>
						<div className="absolute bottom-0 left-0 w-24 h-24 bg-red-500/5 rounded-tr-full"></div>

						<div className="px-8 py-12 text-center relative z-10">
							<div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
								<AlertCircle className="w-10 h-10 text-red-600" />
							</div>

							<h2 className="text-3xl font-bold text-gray-900 mb-4">Link Tidak Valid</h2>
							<p className="text-gray-600 mb-2">
								Link reset password tidak valid atau tidak lengkap.
							</p>
							<p className="text-gray-500 text-sm mb-8">
								Pastikan Anda menggunakan link lengkap dari email yang kami kirimkan. Jika link
								rusak, silakan minta link reset password baru.
							</p>

							<Link to="/forgot-password">
								<DynamicButton
									variant="success"
									className="w-full py-3 rounded-lg font-medium transition-all transform hover:scale-105">
									<Mail className="w-4 h-4 mr-2 inline" />
									Minta Link Baru
								</DynamicButton>
							</Link>
						</div>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-lg w-full">
				<div className="bg-white rounded-xl shadow-xl overflow-hidden border-t-4 border-emerald-500 relative">
					<div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-bl-full"></div>
					<div className="absolute bottom-0 left-0 w-24 h-24 bg-emerald-500/5 rounded-tr-full"></div>
					<div className="px-8 py-12 relative z-10">
						{/* Back Button */}
						<Link
							to="/login"
							className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-8 transition-colors">
							<ArrowLeft className="w-4 h-4 mr-2" />
							Kembali ke Login
						</Link>

						{/* Header with Icon */}
						<div className="text-center mb-8">
							<div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
								<Shield className="w-8 h-8 text-emerald-600" />
							</div>
							<h2 className="text-3xl font-bold text-gray-900 mb-2">Reset Password</h2>
							<p className="text-gray-600">Masukkan password baru yang aman untuk akun Anda</p>
						</div>

						{/* Reset Password Form */}
						<form onSubmit={handleSubmit} className="space-y-6">
							{/* Email Field */}
							<div>
								<label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
									Email Address
								</label>
								<div className="relative">
									<Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
									<input
										type="email"
										id="email"
										name="email"
										value={formData.email}
										onChange={handleInputChange}
										className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
										placeholder="your@example.com"
										disabled={isLoading || !!searchParams.get("email")}
										required
									/>
								</div>
								{searchParams.get("email") && (
									<div className="mt-2 text-xs text-blue-600">
										Email sudah terisi otomatis dari link reset password
									</div>
								)}
							</div>

							{/* New Password Field */}
							<div>
								<label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
									Password Baru
								</label>
								<div className="relative">
									<Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
									<input
										type={showPassword ? "text" : "password"}
										id="password"
										name="password"
										value={formData.password}
										onChange={handleInputChange}
										className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
										placeholder="••••••••"
										disabled={isLoading}
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
								{/* Password Requirements */}
								<div className="mt-2 text-xs text-gray-500">
									<div className="flex justify-between items-center mb-2">
										<span>Password harus mengandung:</span>
										{passwordStrength && (
											<span className={`font-medium ${getPasswordStrengthColor(passwordStrength)}`}>
												{getPasswordStrengthText(passwordStrength)}
											</span>
										)}
									</div>
									<ul className="list-disc list-inside space-y-1">
										<li className={formData.password.length >= 8 ? "text-green-600" : ""}>
											Minimal 8 karakter
										</li>
										<li
											className={
												/[A-Z]/.test(formData.password) && /[a-z]/.test(formData.password)
													? "text-green-600"
													: ""
											}>
											Huruf besar dan kecil
										</li>
										<li className={/\d/.test(formData.password) ? "text-green-600" : ""}>
											Minimal 1 angka
										</li>
										<li
											className={
												/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)
													? "text-green-600"
													: "text-gray-400"
											}>
											Simbol (opsional)
										</li>
									</ul>

									{/* Password Strength Bar */}
									{passwordStrength && (
										<div className="mt-3">
											<div className="w-full bg-gray-200 rounded-full h-2">
												<div
													className={`h-2 rounded-full transition-all duration-300 ${
														passwordStrength === "very-strong"
															? "w-full bg-green-600"
															: passwordStrength === "strong"
															? "w-3/4 bg-green-500"
															: passwordStrength === "medium"
															? "w-1/2 bg-yellow-500"
															: passwordStrength === "weak"
															? "w-1/4 bg-red-500"
															: "w-0"
													}`}></div>
											</div>
										</div>
									)}
								</div>
							</div>

							{/* Confirm Password Field */}
							<div>
								<label
									htmlFor="confirmPassword"
									className="block text-sm font-medium text-gray-700 mb-1">
									Konfirmasi Password
								</label>
								<div className="relative">
									<Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
									<input
										type={showConfirmPassword ? "text" : "password"}
										id="confirmPassword"
										name="confirmPassword"
										value={formData.confirmPassword}
										onChange={handleInputChange}
										className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
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

								{/* Password Match Indicator */}
								{formData.confirmPassword && (
									<div className="mt-2 text-xs">
										{formData.password === formData.confirmPassword ? (
											<span className="text-green-600 flex items-center">
												<CheckCircle className="w-3 h-3 mr-1" />
												Password cocok
											</span>
										) : (
											<span className="text-red-500 flex items-center">
												<AlertCircle className="w-3 h-3 mr-1" />
												Password tidak cocok
											</span>
										)}
									</div>
								)}
							</div>

							{/* Submit Button */}
							<DynamicButton
								type="submit"
								variant="success"
								disabled={
									isLoading || !formData.email || !formData.password || !formData.confirmPassword
								}
								className="w-full text-white py-3 rounded-lg font-medium transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
								{isLoading ? (
									<div className="flex items-center justify-center space-x-2">
										<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
										<span>Mengubah Password...</span>
									</div>
								) : (
									<>
										<CheckCircle className="w-4 h-4 mr-2 inline" />
										Reset Password
									</>
								)}
							</DynamicButton>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
}
