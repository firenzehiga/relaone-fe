import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "react-hot-toast";
import { ChakraProvider } from "@chakra-ui/react";
import "@/index.css";
import App from "@/App.jsx";
import { BrowserRouter } from "react-router-dom";
import { useAuthStore } from "@/_hooks/useAuth";


const queryClient = new QueryClient();

/**
 * Entry point aplikasi React
 * Mengatur provider untuk React Query dan render aplikasi utama
 * Dilengkapi dengan React Query DevTools untuk development
 */
// Panggil initializeAuth satu kali sebelum render agar store ter-rehydrate
// dan verifikasi token berjalan di background. Ini membantu mencegah UI
// "flash" pada saat refresh (header, menu user, dsb.).
// Karena pemanggilan ini async, kita tidak memblokir render: komponen
// `AuthInitializer` akan menunggu flag `initialized` di store.
// Note: jangan memanggil initializeAuth terlalu sering — cukup sekali saat startup.
const init = async () => {
	try {
		await useAuthStore.getState().initializeAuth();
	} catch (e) {
		// ignore errors — initializeAuth sudah men-handle cleanup
	}
};

// mulai inisialisasi (tidak menunggu selesai)
init();

// Initial page load performance logging (fires on full page load)
// if (typeof window !== 'undefined') {
// 		window.addEventListener('load', () => {
// 			try {
// 				const nav = performance.getEntriesByType('navigation')?.[0];
// 				// Beberapa browser/condition mungkin tidak mengisi loadEventEnd.
// 				// Jika loadEventEnd kosong (0), gunakan fallback performance.now() yang
// 				// mengukur waktu sejak navigation start hingga saat ini.
// 				let loadTime = null;
// 				let domComplete = null;
// 				if (nav) {
// 					if (nav.loadEventEnd && nav.loadEventEnd > (nav.startTime || 0)) {
// 						loadTime = Math.round(nav.loadEventEnd - (nav.startTime || 0));
// 					} else if (typeof performance !== 'undefined' && performance.now) {
// 						loadTime = Math.round(performance.now());
// 					}

// 					domComplete = nav.domComplete ? Math.round(nav.domComplete) : (typeof performance !== 'undefined' && performance.now ? Math.round(performance.now()) : null);
// 				}

// 				const fmt = (ms) => (ms === null ? '-' : (ms >= 1000 ? `${(ms/1000).toFixed(2)} S` : `${ms} MS`));
// 				if (import.meta.env && import.meta.env.DEV) {
// 					console.log(
// 						`[PERFORMANCE] WAKTU MUAT HALAMAN (FULL PAGE LOAD): ${fmt(loadTime)}. WAKTU HINGGA DOM SELESAI (DOM COMPLETE): ${fmt(domComplete)}.`
// 					);
// 				}
// 			} catch (e) {
// 				// ignore
// 			}
// 		});
// }

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<QueryClientProvider client={queryClient}>
			<BrowserRouter>
				<ChakraProvider>
					<App />
				</ChakraProvider>
				<Toaster position="top-right" reverseOrder={false} gutter={8} />
			</BrowserRouter>
			<ReactQueryDevtools initialIsOpen={false} />
		</QueryClientProvider>
	</StrictMode>
);
