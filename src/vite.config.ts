import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
	build: {
		rollupOptions: {
			input: {
				main: resolve(__dirname, "index.html"),
				oauth: resolve(__dirname, "oauth.html"),
			},
		},
		target: "esnext",
	},
});
