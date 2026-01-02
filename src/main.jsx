import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "react-hot-toast";
import { ChakraProvider } from "@chakra-ui/react";
import { ThemeProvider } from "next-themes";
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

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<QueryClientProvider client={queryClient}>
			<BrowserRouter>
				<ThemeProvider attribute="class" defaultTheme="light">
					<ChakraProvider>
						<App />
					</ChakraProvider>
				</ThemeProvider>
				<Toaster position="top-right" reverseOrder={false} gutter={8} />
			</BrowserRouter>
			<ReactQueryDevtools initialIsOpen={false} />
		</QueryClientProvider>
	</StrictMode>
);
