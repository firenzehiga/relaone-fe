import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Eye, EyeOff, CheckCircle, AlertCircle, Lock } from "lucide-react";
import { showToast } from "@/components/ui/Toast";

import { useChangePassword, useAuthStore } from "@/_hooks/useAuth";
import { useDocumentTitle } from "@/_hooks/utils/useDocumentTitle";

import Button from "@/components/ui/Button";

export default function ChangePasswordPage() {
	useDocumentTitle("Change Password");

	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [showPwd, setShowPwd] = useState(false);

	const navigate = useNavigate();
	const changePasswordMutation = useChangePassword();
	const { isLoading } = useAuthStore();

	const validatePassword = (password) => {
		const minLength = 8;

		if (password.length < minLength) {
			return "Password minimal 8 karakter";
		}

		return "";
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		// Basic validation
		if (!currentPassword || !newPassword || !confirmPassword) {
			showToast({
				type: "error",
				title: "Field Diperlukan",
				message: "Mohon isi semua field yang diperlukan",
				duration: 2000,
				position: "top-center",
			});
			return;
		}

		const pwdError = validatePassword(newPassword);
		if (pwdError) {
			showToast({
				type: "error",
				title: "Password Tidak Valid",
				message: pwdError,
				duration: 3000,
				position: "top-center",
			});
			return;
		}

		if (newPassword !== confirmPassword) {
			showToast({
				type: "error",
				title: "Password Tidak Cocok",
				message: "Konfirmasi password tidak sesuai",
				duration: 2000,
				position: "top-center",
			});
			return;
		}

		changePasswordMutation.mutate({ currentPassword, newPassword });
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-lg w-full">
				{/* Green accent card */}
				<div className="bg-white rounded-xl shadow-xl overflow-hidden border-t-4 border-emerald-500 relative">
					<div className="px-8 py-8 relative z-10">
						<div className="text-center mb-6">
							<div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
								<Lock className="w-6 h-6 text-emerald-600" />
							</div>
							<h2 className="text-2xl font-bold text-gray-900 mb-1">Ganti Password</h2>
							<p className="text-gray-600">Masukkan password lama dan password baru yang aman</p>
						</div>

						<form onSubmit={handleSubmit} className="space-y-6">
							{/* Current Password */}
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Password Saat Ini
								</label>
								<div className="relative">
									<input
										type={showPwd ? "text" : "password"}
										value={currentPassword}
										onChange={(e) => setCurrentPassword(e.target.value)}
										className="w-full pl-3 pr-10 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"
										placeholder="••••••••"
										required
									/>
									<button
										type="button"
										onClick={() => setShowPwd(!showPwd)}
										className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
										{showPwd ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
									</button>
								</div>
							</div>

							{/* New Password */}
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Password Baru
								</label>
								<input
									type="password"
									value={newPassword}
									onChange={(e) => setNewPassword(e.target.value)}
									className="w-full pl-3 pr-3 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"
									placeholder="••••••••"
									required
								/>
							</div>

							{/* Confirm Password */}
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Konfirmasi Password
								</label>
								<input
									type="password"
									value={confirmPassword}
									onChange={(e) => setConfirmPassword(e.target.value)}
									className="w-full pl-3 pr-3 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"
									placeholder="••••••••"
									required
								/>

								{/* Match indicator */}
								{confirmPassword && (
									<div className="mt-2 text-xs">
										{newPassword === confirmPassword ? (
											<span className="text-green-600 flex items-center">
												<CheckCircle className="w-3 h-3 mr-1" /> Password cocok
											</span>
										) : (
											<span className="text-red-500 flex items-center">
												<AlertCircle className="w-3 h-3 mr-1" /> Password tidak cocok
											</span>
										)}
									</div>
								)}
							</div>

							{/* Actions */}
							<div className="flex items-center justify-end space-x-2">
								<Button variant="outline" onClick={() => navigate(-1)} type="button">
									Batal
								</Button>
								<Button variant="success" type="submit" loading={isLoading}>
									Simpan
								</Button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
}
