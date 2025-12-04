import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, UserCheck, QrCode, MessageSquare, PartyPopper } from "lucide-react";
import Stepper, { Step } from "@/components/ui/Stepper";
import { useModalStore } from "@/stores/useAppStore";

/**
 * OnboardingModal - Panduan untuk volunteer baru
 * Menampilkan stepper guide tentang cara menggunakan platform
 */
export default function OnboardingModal() {
	const { isOnboardingModalOpen, closeOnboardingModal } = useModalStore();
	const [currentStep, setCurrentStep] = useState(1);

	const handleComplete = () => {
		// localStorage.setItem("volunteer_onboarding_completed", "true");
		closeOnboardingModal();
	};

	if (!isOnboardingModalOpen) return null;

	return (
		<AnimatePresence>
			{isOnboardingModalOpen && (
				<>
					{/* Backdrop */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						onClick={closeOnboardingModal}
						className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
					/>

					{/* Modal */}
					<div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 pointer-events-none">
						<motion.div
							initial={{ opacity: 0, scale: 0.95, y: 20 }}
							animate={{ opacity: 1, scale: 1, y: 0 }}
							exit={{ opacity: 0, scale: 0.95, y: 20 }}
							className="relative w-full max-w-3xl bg-white rounded-xl sm:rounded-2xl shadow-2xl pointer-events-auto">
							{/* Close Button */}
							<button
								onClick={closeOnboardingModal}
								className="absolute top-3 right-3 z-10 p-1.5 sm:p-2 rounded-full hover:bg-gray-100 transition-colors">
								<X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
							</button>

							{/* Stepper Content - Override default styles */}
							<div className="p-4 sm:p-6 [&_.flex.min-h-full]:min-h-0 [&_.flex.min-h-full]:p-0 [&_.flex.min-h-full]:aspect-auto">
								<Stepper
									initialStep={1}
									onStepChange={setCurrentStep}
									onFinalStepCompleted={handleComplete}
									stepCircleContainerClassName="!border-0 !shadow-none !rounded-none"
									stepContainerClassName="!p-4 sm:!p-6"
									contentClassName="!px-4 sm:!px-6"
									footerClassName="!px-4 sm:!px-6 !pb-4 sm:!pb-6"
									nextButtonText="Lanjut"
									backButtonText="Kembali">
									{/* Step 1: Welcome */}
									<Step>
										<div className="text-center space-y-4 py-2">
											<div className="flex justify-center">
												<div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-100 rounded-full flex items-center justify-center">
													<PartyPopper className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-600" />
												</div>
											</div>
											<h2 className="text-xl sm:text-2xl font-bold text-gray-900">
												Selamat Datang di RelaOne!
											</h2>
											<p className="text-sm sm:text-base text-gray-600 max-w-lg mx-auto leading-relaxed">
												Terima kasih telah bergabung sebagai volunteer. Mari kami pandu Anda untuk
												memulai perjalanan berbagi kebaikan bersama kami.
											</p>
											<div className="pt-2">
												<div className="inline-flex items-center space-x-2 bg-emerald-50 px-4 py-2 rounded-lg">
													<span className="text-sm sm:text-base text-emerald-700 font-medium">
														4 langkah mudah
													</span>
												</div>
											</div>
										</div>
									</Step>

									{/* Step 2: Cara Cari Event */}
									<Step>
										<div className="space-y-5 py-2">
											<div className="flex justify-center">
												<div className="w-14 h-14 sm:w-16 sm:h-16 bg-blue-100 rounded-full flex items-center justify-center">
													<Search className="w-7 h-7 sm:w-8 sm:h-8 text-blue-600" />
												</div>
											</div>
											<h3 className="text-lg sm:text-xl font-bold text-gray-900 text-center">
												Mencari Event Volunteer
											</h3>
											<div className="space-y-4 max-w-lg mx-auto">
												<div className="flex items-start space-x-3">
													<div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0 font-semibold text-sm">
														1
													</div>
													<div>
														<p className="text-sm sm:text-base text-gray-700 font-medium">
															Kunjungi halaman "Event"
														</p>
														<p className="text-xs sm:text-sm text-gray-500">
															Lihat berbagai kegiatan volunteer yang tersedia
														</p>
													</div>
												</div>
												<div className="flex items-start space-x-3">
													<div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0 font-semibold text-sm">
														2
													</div>
													<div>
														<p className="text-sm sm:text-base text-gray-700 font-medium">
															Filter berdasarkan kategori
														</p>
														<p className="text-xs sm:text-sm text-gray-500">
															Pilih kategori yang sesuai minat Anda
														</p>
													</div>
												</div>
												<div className="flex items-start space-x-3">
													<div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0 font-semibold text-sm">
														3
													</div>
													<div>
														<p className="text-sm sm:text-base text-gray-700 font-medium">
															Baca detail event
														</p>
														<p className="text-xs sm:text-sm text-gray-500">
															Pelajari informasi lengkap sebelum mendaftar
														</p>
													</div>
												</div>
											</div>
										</div>
									</Step>

									{/* Step 3: Cara Join Event */}
									<Step>
										<div className="space-y-5 py-2">
											<div className="flex justify-center">
												<div className="w-14 h-14 sm:w-16 sm:h-16 bg-purple-100 rounded-full flex items-center justify-center">
													<UserCheck className="w-7 h-7 sm:w-8 sm:h-8 text-purple-600" />
												</div>
											</div>
											<h3 className="text-lg sm:text-xl font-bold text-gray-900 text-center">
												Mendaftar & Mengikuti Event
											</h3>
											<div className="space-y-4 max-w-lg mx-auto">
												<div className="flex items-start space-x-3">
													<div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0 font-semibold text-sm">
														1
													</div>
													<div>
														<p className="text-sm sm:text-base text-gray-700 font-medium">
															Klik tombol "Daftar Sekarang"
														</p>
														<p className="text-xs sm:text-sm text-gray-500">
															Isi formulir pendaftaran dengan lengkap
														</p>
													</div>
												</div>
												<div className="flex items-start space-x-3">
													<div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0 font-semibold text-sm">
														2
													</div>
													<div>
														<p className="text-sm sm:text-base text-gray-700 font-medium">
															Tunggu proses konfirmasi
														</p>
														<p className="text-xs sm:text-sm text-gray-500">
															Anda akan menerima email konfirmasi jika diterima
														</p>
													</div>
												</div>
												<div className="flex items-start space-x-3">
													<div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0 font-semibold text-sm">
														3
													</div>
													<div>
														<p className="text-sm sm:text-base text-gray-700 font-medium">
															Dapatkan QR Code
														</p>
														<p className="text-xs sm:text-sm text-gray-500">
															QR Code akan muncul di halaman "Aktivitas Saya" setelah dikonfirmasi
														</p>
													</div>
												</div>
												<div className="flex items-start space-x-3">
													<div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0 font-semibold text-sm">
														3
													</div>
													<div>
														<p className="text-sm sm:text-base text-gray-700 font-medium">
															Scan saat hadir
														</p>
														<p className="text-xs sm:text-sm text-gray-500">
															Tunjukkan QR Code ke organisasi untuk check-in
														</p>
													</div>
												</div>
											</div>
										</div>
									</Step>

									{/* Step 4: Feedback */}
									<Step>
										<div className="space-y-5 py-2">
											<div className="flex justify-center">
												<div className="w-14 h-14 sm:w-16 sm:h-16 bg-amber-100 rounded-full flex items-center justify-center">
													<MessageSquare className="w-7 h-7 sm:w-8 sm:h-8 text-amber-600" />
												</div>
											</div>
											<h3 className="text-lg sm:text-xl font-bold text-gray-900 text-center">
												Berikan Feedback
											</h3>
											<div className="space-y-4 max-w-lg mx-auto">
												<p className="text-sm sm:text-base text-gray-600 text-center">
													Setelah event selesai, jangan lupa berikan feedback Anda
												</p>
												<div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
													<div className="flex items-start space-x-3">
														<QrCode className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
														<div>
															<p className="text-sm font-medium text-emerald-900">
																Tips: Simpan QR Code Anda
															</p>
															<p className="text-sm text-emerald-700 mt-1">
																Screenshot atau simpan QR Code untuk akses cepat saat hari kegiatan
																berlangsung
															</p>
														</div>
													</div>
												</div>
												<div className="text-center pt-2">
													<p className="text-sm sm:text-base text-gray-700 font-medium mb-1">
														Siap untuk memulai?
													</p>
													<p className="text-xs sm:text-sm text-gray-500">
														Klik "Complete" untuk mulai menjelajah event
													</p>
												</div>
											</div>
										</div>
									</Step>
								</Stepper>
							</div>
						</motion.div>
					</div>
				</>
			)}
		</AnimatePresence>
	);
}
