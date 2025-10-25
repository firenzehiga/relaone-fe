import { useEffect } from "react";
import { useLocation } from "react-router";

/**
 * Komponen untuk mengscroll halaman ke atas
 * Digunakan untuk mengatasi efek dari navigasi antara halaman
 * Menggunakan hook `useLocation` untuk mendapatkan lokasi pathname
 * Menggunakan hook `useEffect` untuk mengatur efek scroll
 */
export function ScrollToTop() {
	const { pathname } = useLocation();

	useEffect(() => {
		window.scrollTo({
			top: 0,
			left: 0,
			behavior: "smooth",
		});
	}, [pathname]);

	return null;
}
