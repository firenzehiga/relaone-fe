import { cn } from "@/utils";
import { useState } from "react";

/**
 * Komponen Avatar untuk menampilkan foto profil pengguna atau inisial nama
 * Secara otomatis fallback ke inisial jika gambar tidak tersedia atau gagal dimuat
 *
 * @param {Object} props - Props untuk Avatar component
 * @param {string} [props.src] - URL gambar avatar, jika tidak ada akan menampilkan fallback
 * @param {string} [props.alt] - Alt text untuk gambar avatar
 * @param {string} [props.size="md"] - Ukuran avatar (sm, md, lg, xl, 2xl)
 * @param {string} [props.fallback] - Nama untuk generate inisial jika src tidak tersedia
 * @param {string} [props.className] - Class CSS tambahan untuk styling kustom
 * @param {...any} props - Props tambahan yang akan di-forward ke element img atau div
 * @returns {JSX.Element} Avatar component berupa gambar atau inisial nama
 */
export default function Avatar({
	src,
	alt,
	size = "md",
	fallback,
	className,
	...props
}) {
	const [imageError, setImageError] = useState(false);
	const [imageLoaded, setImageLoaded] = useState(false);
	const sizes = {
		sm: "w-8 h-8 text-sm",
		md: "w-10 h-10 text-base",
		lg: "w-12 h-12 text-lg",
		xl: "w-16 h-16 text-xl",
		"2xl": "w-20 h-20 text-2xl",
	};

	/**
	 * Generate inisial dari nama untuk ditampilkan sebagai fallback
	 * Mengambil huruf pertama dari setiap kata, maksimal 2 karakter
	 *
	 * @param {string} name - Nama lengkap untuk diambil inisialnya
	 * @returns {string} Inisial nama dalam huruf kapital (maksimal 2 karakter)
	 */
	const getFallbackInitials = (name) => {
		if (!name) return "?";
		return name
			.split(" ")
			.map((n) => n[0])
			.join("")
			.toUpperCase()
			.slice(0, 2);
	};

	/**
	 * Handler untuk error loading gambar
	 * Set imageError ke true agar fallback ditampilkan
	 */
	const handleImageError = () => {
		setImageError(true);
		setImageLoaded(false);
	};

	/**
	 * Handler untuk sukses loading gambar
	 * Set imageLoaded ke true dan imageError ke false
	 */
	const handleImageLoad = () => {
		setImageLoaded(true);
		setImageError(false);
	};

	// Tampilkan fallback jika:
	// 1. Tidak ada src
	// 2. Ada error saat loading gambar
	// 3. Gambar belum selesai loading dan ada error sebelumnya
	const shouldShowFallback = !src || imageError;

	if (src && !shouldShowFallback) {
		return (
			<img
				src={src}
				alt={alt || "Avatar"}
				onError={handleImageError}
				onLoad={handleImageLoad}
				className={cn(
					"rounded-full object-cover border-2 border-gray-600",
					sizes[size],
					className
				)}
				{...props}
			/>
		);
	}

	return (
		<div
			className={cn(
				"rounded-full bg-emerald-600 flex items-center justify-center text-gray-200 font-medium border-2 border-emerald-600",
				sizes[size],
				className
			)}
			{...props}>
			{getFallbackInitials(fallback)}
		</div>
	);
}
