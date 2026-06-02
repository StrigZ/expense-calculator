import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig(({ mode }) => ({
	build: {
		sourcemap: mode === "development",
	},
	plugins: [tailwindcss()],
}));
