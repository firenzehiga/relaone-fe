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

	const behavior =
		pathname.includes("terms-of-service") || pathname.includes("privacy-policy")
			? "instant"
			: "smooth";
	useEffect(() => {
		window.scrollTo({
			top: 0,
			left: 0,
			behavior: behavior,
		});
	}, [pathname]);

	return null;
}
