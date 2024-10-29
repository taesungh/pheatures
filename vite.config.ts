import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
	base: "/pheatures/", // for deployment on GitHub pages
	plugins: [react()],
	resolve: {
		alias: {
			"@/": "/src/",
		},
	},
	assetsInclude: ["**/*.tsv", "**/*.inv"],
});
