import React, { useState, useRef, useEffect } from "react";
import {
	X,
	Search,
	Book,
	Users,
	MessageCircleQuestionIcon,
	Zap,
	Settings,
	CheckCircle2,
	Heart,
	Copy,
	Check,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const faqData = [
	{
		id: 1,
		category: "Memulai",
		icon: Book,
		questions: [
			{
				id: "gs1",
				question: "Bagaimana cara mendaftar di RelaOne?",
				answer:
					"Langkah-langkah mendaftar:\n\n1. Klik tombol 'Masuk' di pojok kanan atas\n2. Pilih 'Daftar Baru'\n3. Isi data diri Anda (nama, email, password)\n4. Verifikasi email Anda\n5. Selesai! Akun siap digunakan",
			},
			{
				id: "gs2",
				question: "Apakah gratis mendaftar di RelaOne?",
				answer:
					"✅ Ya, pendaftaran akun di RelaOne sepenuhnya GRATIS!\n\n• Tidak ada biaya pendaftaran\n• Tidak ada biaya tersembunyi\n• Akses semua fitur tanpa biaya tambahan\n\nRelaOne murni platform untuk menghubungkan relawan dengan organisasi sosial.",
			},
			{
				id: "gs3",
				question: "Bagaimana cara menggunakan RelaOne?",
				answer:
					"Langkah-langkah menggunakan RelaOne:\n\n1. Daftar dan buat akun relawan\n2. Lengkapi profil Anda\n3. Browse kegiatan yang tersedia di menu 'Kegiatan'\n4. Cari kegiatan yang sesuai minat Anda\n5. Klik kegiatan dan baca detail lengkapnya\n6. Klik 'Daftar Sekarang' untuk bergabung\n7. Tunggu konfirmasi dari organisasi\n8. Ikuti kegiatan pada jadwal yang ditentukan!",
			},
		],
	},
	{
		id: 2,
		category: "Kegiatan Relawan",
		icon: Heart,
		questions: [
			{
				id: "r1",
				question: "Bagaimana cara mencari kegiatan?",
				answer:
					"Langkah mencari kegiatan:\n\n1. Klik menu 'Kegiatan' di halaman utama\n2. Jelajahi daftar kegiatan yang tersedia\n3. Gunakan filter untuk kategori atau lokasi\n4. Klik salah satu kegiatan untuk melihat detail\n5. Lihat informasi: waktu, lokasi, jenis kegiatan, dan deskripsi\n6. Baca rating dan feedback dari relawan sebelumnya",
			},
			{
				id: "r2",
				question: "Bagaimana cara mendaftar ke kegiatan?",
				answer:
					"Cara mendaftar kegiatan:\n\n1. Buka halaman detail kegiatan yang ingin diikuti\n2. Klik tombol 'Daftar Sekarang'\n3. Konfirmasi data Anda\n4. Klik 'Konfirmasi Pendaftaran'\n5. Pendaftaran dikirim! Tunggu konfirmasi dari organisasi\n\n✅ Anda akan menerima notifikasi ketika pendaftaran dikonfirmasi",
			},
			{
				id: "r3",
				question: "Bisakah saya membatalkan pendaftaran?",
				answer:
					"Ya, Anda bisa membatalkan pendaftaran:\n\n1. Buka menu 'Aktivitas Saya'\n2. Cari kegiatan yang ingin dibatalkan\n3. Klik tombol 'Batalkan Pendaftaran'\n4. Konfirmasi pembatalan\n\n⚠️ Catatan:\n• Batalkan sebelum kegiatan dimulai\n• Tidak ada penalti atau biaya pembatalan",
			},
		],
	},
	{
		id: 3,
		category: "Saat Kegiatan",
		icon: Zap,
		questions: [
			{
				id: "s1",
				question: "Apa itu check-in QR code?",
				answer:
					"Check-in QR adalah cara mudah untuk absensi kegiatan:\n\n✅ Bagaimana caranya:\n1. Saat kegiatan dimulai, Anda akan diberikan QR code\n2. Buka link atau buka kamera ponsel\n3. Pindai QR code yang ditunjukkan penyelenggara\n4. Check-in tercatat otomatis!\n\n💡 Tips:\n• Pastikan koneksi internet stabil\n• Buka di browser ponsel Anda\n• Pastikan cahaya cukup terang saat scan",
			},
			{
				id: "s2",
				question: "Bagaimana cara memberikan feedback?",
				answer:
					"Feedback membantu meningkatkan kegiatan berikutnya:\n\n1. Setelah kegiatan selesai, cek email Anda\n2. Klik link feedback dari organisasi\n3. Atau buka menu 'Aktivitas Saya'\n4. Pilih kegiatan yang sudah selesai\n5. Klik 'Berikan Rating & Feedback'\n6. Isi rating (bintang) dan komentar\n7. Klik Kirim\n\n⭐ Feedback Anda sangat berarti!",
			},
			{
				id: "s3",
				question: "Apa manfaat menjadi relawan?",
				answer:
					"Menjadi relawan memberikan banyak manfaat meskipun sertifikat tidak selalu tersedia:\n\n• Pengalaman praktis dan keterampilan baru\n• Memperluas jaringan dan relasi profesional\n• Meningkatkan kepercayaan diri dan kemampuan kepemimpinan\n• Kepuasan pribadi karena memberi dampak positif pada masyarakat\n\nCatatan:\n• Beberapa organisasi mungkin memberikan sertifikat, tetapi tidak semua\n• Jika Anda memerlukan sertifikat, tanyakan langsung kepada penyelenggara sebelum mendaftar",
			},
		],
	},
	{
		id: 4,
		category: "Akun & Profil",
		icon: Users,
		questions: [
			{
				id: "a1",
				question: "Bagaimana cara mengedit profil?",
				answer:
					"Langkah mengedit profil:\n\n1. Login ke akun Anda\n2. Klik menu 'Profil' atau ikon profil di pojok atas\n3. Klik tombol 'Edit Profil'\n4. Perbarui informasi:\n   • Nama lengkap\n   • Foto profil\n   • Nomor telepon\n   • Alamat\n   • Minat atau keahlian\n5. Klik 'Simpan Perubahan'\n\n✅ Profil lengkap membantu organisasi memahami Anda!",
			},
			{
				id: "a2",
				question: "Bagaimana cara melihat riwayat kegiatan?",
				answer:
					"Lihat semua kegiatan Anda yang sudah diikuti:\n\n📋 Akses riwayat:\n1. Buka menu 'Aktivitas Saya' atau 'Riwayat Kegiatan'\n2. Lihat daftar kegiatan yang diikuti\n3. Filter status: Akan Datang, Sedang Berlangsung, Selesai\n4. Klik kegiatan untuk detail lengkap\n5. Lihat feedback dan rating Anda\n\n💾 Info yang tersimpan:\n• Tanggal kegiatan\n• Nama organisasi\n• Rating Anda\n• Sertifikat",
			},
			{
				id: "a3",
				question: "Bagaimana cara ubah password?",
				answer:
					"Cara mengubah password:\n\n1. Login ke akun Anda\n2. Buka menu 'Pengaturan' atau 'Akun'\n3. Pilih 'Ubah Password'\n4. Masukkan password lama\n5. Masukkan password baru (minimal 8 karakter)\n6. Konfirmasi password baru\n7. Klik 'Update Password'\n\n🔒 Tips keamanan:\n• Gunakan kombinasi huruf, angka, dan simbol\n• Jangan gunakan password yang sama\n• Ubah password secara berkala",
			},
		],
	},
	{
		id: 5,
		category: "Teknis & Support",
		icon: Settings,
		questions: [
			{
				id: "t1",
				question: "Platform apa saja yang didukung?",
				answer:
					"RelaOne didukung di platform:\n\n💻 Web Browser:\n• Chrome (recommended)\n• Firefox\n• Safari\n• Edge\n\n📱 Mobile:\n• iOS (Safari)\n• Android (Chrome)\n\n✅ Untuk pengalaman terbaik:\n• Gunakan browser terbaru\n• Koneksi internet stabil\n• Resolusi layar responsive",
			},
			{
				id: "t2",
				question: "Lupa password, bagaimana caranya?",
				answer:
					"Cara reset password:\n\n1. Klik 'Lupa Password' di halaman login\n2. Masukkan email yang terdaftar\n3. Cek email Anda untuk link reset\n4. Klik link dalam email (berlaku 15 menit)\n5. Buat password baru yang kuat\n6. Login dengan password baru\n\n⚠️ Jika tidak menerima email:\n• Cek folder Spam/Junk\n• Tunggu beberapa menit dan coba lagi\n• Pastikan email terdaftar benar",
			},
			{
				id: "t3",
				question: "Bagaimana jika saya kesulitan teknis?",
				answer:
					"Jika mengalami masalah teknis:\n\n🔧 Langkah awal:\n1. Refresh browser atau restart aplikasi\n2. Periksa koneksi internet\n3. Clear cache browser\n4. Coba login lagi\n\n💬 Jika masalah berlanjut:\n• Hubungi tim support kami\n• Kirim detail masalah yang dihadapi\n• Sertakan screenshot jika perlu\n• Tim kami siap membantu 24/7",
			},
		],
	},
];

export function FloatingFaQ() {
	const [isOpen, setIsOpen] = useState(false);
	const [isProcessing, setIsProcessing] = useState(false);
	const [copiedId, setCopiedId] = useState(null);
	const [messages, setMessages] = useState([
		{
			id: 0,
			sender: "bot",
			message:
				"Halo! 👋 Saya assistant RelaOne. Ada yang bisa saya bantu tentang platform volunteer kami?",
			time: new Date().toLocaleTimeString([], {
				hour: "2-digit",
				minute: "2-digit",
			}),
			type: "text",
		},
	]);
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedCategory, setSelectedCategory] = useState(null);
	const [showCategories, setShowCategories] = useState(true);
	const messagesEndRef = useRef(null);

	const scrollMessageToTop = () => {
		const container = messagesEndRef.current?.parentElement;
		if (!container) return;

		// Coba untuk menemukan bubble pesan terakhir dan gulir ke atas kontainer.
		// Pengguna dan bot bubble keduanya menggunakan "p-3 rounded-2xl" jadi kita target itu.
		const bubbles = container.querySelectorAll(".p-3.rounded-2xl");
		const lastBubble = bubbles[bubbles.length - 1];

		if (lastBubble) {
			const nudgeUp = 50; // untuk menambahkan sedikit ruang di atas bubble
			setTimeout(() => {
				const containerRect = container.getBoundingClientRect();
				const bubbleRect = lastBubble.getBoundingClientRect();
				const top = bubbleRect.top - containerRect.top + container.scrollTop - nudgeUp;
				container.scrollTo({ top, behavior: "smooth" });
			}, 60);
		} else {
			// Fallback: scroll ke bawah jika tidak ada bubble ditemukan
			container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
		}
	};

	useEffect(() => {
		scrollMessageToTop();
	}, [messages]);

	const addMessage = (message, sender = "user") => {
		const newMessage = {
			id: Date.now(),
			sender,
			message,
			time: new Date().toLocaleTimeString([], {
				hour: "2-digit",
				minute: "2-digit",
			}),
			type: "text",
		};
		setMessages((prev) => [...prev, newMessage]);

		// Hanya scroll ke bawah jika pesan dari bot (asumsi user sudah melihat pesan mereka sendiri)
		if (sender === "bot") {
			setTimeout(() => {
				scrollToBottom();
			}, 100);
		}
	};

	const handleQuestionClick = (question) => {
		if (isProcessing) return;

		setIsProcessing(true);

		// Add user question
		addMessage(question.question, "user");

		// Add a single "typing" bubble (three styled dots) as a temporary bot message
		const typingId = Date.now() + Math.random();
		const typingMessage = {
			id: typingId,
			sender: "bot",
			// Use JSX for a nicely styled animated three-dot indicator (Tailwind classes)
			message: (
				<div className="flex items-center space-x-1">
					<span
						className="w-2 h-2 bg-gray-400 rounded-full inline-block animate-bounce"
						style={{ animationDelay: "0ms" }}
					/>
					<span
						className="w-2 h-2 bg-gray-400 rounded-full inline-block animate-bounce"
						style={{ animationDelay: "120ms" }}
					/>
					<span
						className="w-2 h-2 bg-gray-400 rounded-full inline-block animate-bounce"
						style={{ animationDelay: "240ms" }}
					/>
				</div>
			),
			time: new Date().toLocaleTimeString([], {
				hour: "2-digit",
				minute: "2-digit",
			}),
			type: "typing",
		};
		setMessages((prev) => [...prev, typingMessage]);

		setShowCategories(false);

		// Replace typing bubble with real answer after a short delay
		setTimeout(() => {
			setMessages((prev) => prev.filter((m) => m.id !== typingId));
			addMessage(question.answer, "bot");
			setIsProcessing(false);
		}, 800);
	};

	const handleCopyAnswer = (answerId) => {
		const message = messages.find((m) => m.id === answerId);
		if (message) {
			navigator.clipboard.writeText(message.message).then(() => {
				setCopiedId(answerId);
				setTimeout(() => setCopiedId(null), 2000);
			});
		}
	};

	const handleCategoryClick = (category) => {
		if (isProcessing) return;

		setIsProcessing(true);
		setSelectedCategory(category);
		setShowCategories(false);
		addMessage(`Saya ingin tahu tentang ${category.category}`, "user");

		setTimeout(() => {
			addMessage(`Berikut beberapa pertanyaan umum tentang ${category.category}:`, "bot");
			setIsProcessing(false);
		}, 500);
	};

	const handleBackToCategories = () => {
		if (isProcessing) return;

		setIsProcessing(true);
		setSelectedCategory(null);
		setShowCategories(true);
		setSearchQuery("");
		addMessage("Tampilkan semua kategori", "user");

		setTimeout(() => {
			addMessage("Berikut topik utama yang bisa saya bantu:", "bot");
			setIsProcessing(false);
		}, 500);
	};

	const filteredQuestions = selectedCategory
		? selectedCategory.questions.filter(
				(q) =>
					q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
					q.answer.toLowerCase().includes(searchQuery.toLowerCase())
		  )
		: faqData
				.flatMap((cat) => cat.questions)
				.filter(
					(q) =>
						q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
						q.answer.toLowerCase().includes(searchQuery.toLowerCase())
				);

	return (
		<>
			{/* FAQ Button */}
			<motion.button
				onClick={() => setIsOpen(!isOpen)}
				className="focus:outline-none fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-emerald-500 via-emerald-600  to-emerald-500 text-white rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 flex items-center justify-center group z-40"
				whileHover={{ scale: 1.15 }}
				whileTap={{ scale: 0.95 }}>
				<MessageCircleQuestionIcon className="w-6 h-6 transition-transform duration-300 group-hover:scale-110" />
			</motion.button>

			{/* FAQ Window */}
			<AnimatePresence>
				{isOpen && (
					<motion.div
						initial={{ opacity: 0, scale: 0.8, y: 50 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						exit={{ opacity: 0, scale: 0.8, y: 50 }}
						className="fixed bottom-24 right-6 w-80 h-[32rem] bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 flex flex-col overflow-hidden">
						{/* Header */}
						<div className="p-4 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white">
							<div className="flex items-center justify-between">
								<div className="flex items-center space-x-3">
									<div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
										<MessageCircleQuestionIcon className="w-5 h-5" />
									</div>
									<div>
										<h3 className="font-semibold text-sm">RelaOne Assistant</h3>
										<p className="text-xs text-emerald-100">Bantuan & FAQ</p>
									</div>
								</div>
								<button
									onClick={() => setIsOpen(false)}
									className="p-1 hover:bg-white/20 rounded-lg transition-colors">
									<X className="w-4 h-4" />
								</button>
							</div>
						</div>

						{/* Messages */}
						<div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50 to-white">
							{messages.map((message) => (
								<motion.div
									key={message.id}
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
									<div className={`max-w-xs ${message.sender === "user" ? "order-2" : "order-1"}`}>
										{message.sender === "bot" && (
											<div className="flex items-center space-x-2 mb-1">
												<div className="w-6 h-6 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center">
													<MessageCircleQuestionIcon className="w-3 h-3 text-white" />
												</div>
												<span className="text-xs text-gray-500">RelaOne Assistant</span>
											</div>
										)}
										<div
											className={`p-3 rounded-2xl group transition-all ${
												message.sender === "user"
													? "bg-emerald-600 text-white rounded-br-md"
													: "bg-gray-200 text-gray-900 rounded-bl-md shadow-sm border border-gray-300"
											}`}>
											<p className="text-sm whitespace-pre-line leading-relaxed">
												{message.message}
											</p>
											{message.sender === "bot" && message.type === "text" && (
												<motion.button
													whileHover={{ scale: 1.1 }}
													onClick={() => handleCopyAnswer(message.id)}
													className="opacity-0 group-hover:opacity-100 transition-opacity absolute mt-1 p-1 hover:bg-gray-300 rounded text-gray-600">
													{copiedId === message.id ? (
														<Check className="w-3 h-3 text-green-600" />
													) : (
														<Copy className="w-3 h-3" />
													)}
												</motion.button>
											)}
										</div>
										<p className="text-xs text-gray-400 mt-1 text-center">{message.time}</p>
									</div>
								</motion.div>
							))}

							{/* Categories or Questions */}
							{showCategories && (
								<motion.div
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									className="space-y-2">
									<div className="text-xs text-gray-500 text-center mb-3 font-medium">
										Pilih topik:
									</div>
									{faqData.map((category) => (
										<motion.button
											key={category.id}
											whileHover={{ x: 4 }}
											onClick={() => handleCategoryClick(category)}
											disabled={isProcessing}
											className={`w-full p-3 bg-white rounded-xl border-2 transition-all duration-200 text-left ${
												isProcessing
													? "opacity-50 cursor-not-allowed"
													: "border-gray-200 hover:border-emerald-400 hover:bg-emerald-50"
											}`}>
											<div className="flex items-center space-x-3">
												<div className="p-2 bg-emerald-100 rounded-lg">
													<category.icon className="w-5 h-5 text-emerald-600" />
												</div>
												<span className="font-medium text-gray-900 text-sm">
													{category.category}
												</span>
											</div>
										</motion.button>
									))}
								</motion.div>
							)}

							{selectedCategory && (
								<motion.div
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									className="space-y-2">
									<div className="flex items-center justify-between mb-3">
										<div className="text-xs text-gray-600 font-medium">
											{selectedCategory.category}
										</div>
										<motion.button
											whileHover={{ x: -4 }}
											onClick={handleBackToCategories}
											disabled={isProcessing}
											className={`focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 focus:outline-none outline-none text-xs transition-colors font-medium ${
												isProcessing
													? "text-gray-400 cursor-not-allowed"
													: "text-emerald-600 hover:text-emerald-700"
											}`}>
											← Kembali
										</motion.button>
									</div>
									{selectedCategory.questions.map((question) => (
										<motion.button
											key={question.id}
											whileHover={{ x: 4 }}
											onClick={() => handleQuestionClick(question)}
											disabled={isProcessing}
											className={`w-full p-3 bg-white rounded-xl border-2 transition-all duration-200 text-left ${
												isProcessing
													? "opacity-50 cursor-not-allowed"
													: "border-gray-200 hover:border-emerald-400 hover:bg-emerald-50"
											}`}>
											<p className="text-sm font-medium text-gray-900">{question.question}</p>
										</motion.button>
									))}
								</motion.div>
							)}

							<div ref={messagesEndRef} />
						</div>

						{/* Search Input */}
						<div className="p-3 border-t border-gray-200 bg-gradient-to-b from-white to-gray-50 space-y-3">
							<div className="flex items-center space-x-2">
								<div className="flex-1 relative">
									<Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
									<input
										type="text"
										value={searchQuery}
										onChange={(e) => setSearchQuery(e.target.value)}
										placeholder="Cari Pertanyaan..."
										className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm transition-all"
									/>
								</div>
								{searchQuery && (
									<motion.button
										whileHover={{ scale: 1.05 }}
										onClick={() => setSearchQuery("")}
										disabled={isProcessing}
										className={`px-2 py-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors ${
											isProcessing ? "opacity-50 cursor-not-allowed" : ""
										}`}>
										<X className="w-4 h-4" />
									</motion.button>
								)}
							</div>

							{/* Search Results */}
							{searchQuery && (
								<motion.div
									initial={{ opacity: 0, y: -10 }}
									animate={{ opacity: 1, y: 0 }}
									className="max-h-32 overflow-y-auto space-y-1">
									{filteredQuestions.slice(0, 4).map((question) => (
										<motion.button
											key={question.id}
											whileHover={{ x: 4 }}
											onClick={() => {
												handleQuestionClick(question);
												setSearchQuery("");
											}}
											className="w-full p-2 text-left text-xs bg-white hover:bg-emerald-50 rounded-lg transition-colors border border-gray-200 hover:border-emerald-300">
											<div className="flex items-start space-x-2">
												<CheckCircle2 className="w-3 h-3 text-emerald-600 mt-0.5 flex-shrink-0" />
												<span className="text-gray-700 line-clamp-2">{question.question}</span>
											</div>
										</motion.button>
									))}
									{filteredQuestions.length === 0 && (
										<p className="text-xs text-gray-500 p-3 text-center">
											Tidak ada hasil ditemukan
										</p>
									)}
								</motion.div>
							)}
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</>
	);
}
