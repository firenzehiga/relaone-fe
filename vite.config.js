import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
	plugins: [react()],
	server: {
		watch: {
			usePolling: true,
		},
	},
	optimizeDeps: {
		exclude: ["lucide-react"],
	},
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
			// contoh tambahan:
			// "@components": path.resolve(__dirname, "./src/components"),
		},
	},
});
