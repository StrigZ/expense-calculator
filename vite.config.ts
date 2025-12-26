import { defineConfig } from "vite";

export default defineConfig(({ mode }) => ({
	base: "/expense-calculator/",
	build: {
		sourcemap: mode === "development",
	},
}));
