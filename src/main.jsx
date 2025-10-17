import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import "@/index.css";
import App from "@/App.jsx";
import { BrowserRouter } from "react-router-dom";
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
				// Retry maksimal 2 kali untuk error lainnya (lebih cepat)
				return failureCount < 2;
			},
			retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 3000), // Max 3 detik delay
		},
	},
});

/**
 * Entry point aplikasi React
 * Mengatur provider untuk React Query dan render aplikasi utama
 * Dilengkapi dengan React Query DevTools untuk development
 */
createRoot(document.getElementById("root")).render(
	<StrictMode>
		<QueryClientProvider client={queryClient}>
			<BrowserRouter>
				<App />
			</BrowserRouter>
			<ReactQueryDevtools initialIsOpen={false} />
		</QueryClientProvider>
	</StrictMode>
);
