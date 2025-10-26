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
/**
 * Konfigurasi React Query Client untuk manajemen state server
 * Mengatur default options untuk caching, retry logic, dan error handling
 */
const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 1000 * 60 * 5, // 5 minutes - data akan dianggap fresh selama 5 menit
			retry: (failureCount, error) => {
				// Jangan retry jika error 404 (Not Found) atau timeout
				if (error?.response?.status === 404) return false;
				if (error?.code === "ECONNABORTED") return false; // Timeout error
				if (error?.message?.includes("timeout")) return false;
				// Retry maksimal 1 kali untuk error lainnya (lebih cepat)
				return failureCount < 1;
			},
			retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 2000), // Max 2 detik delay
		},
	},
});

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
