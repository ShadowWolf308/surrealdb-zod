import { defineConfig } from "vite";

export default defineConfig((env) => ({
	publicDir: env.command === "serve" ? "public" : undefined,
	build: {
		lib: {
			entry: "./lib/index.ts",
			name: "surrealdbZod",
			fileName: "surrealdbZod",
		},
		rollupOptions: {
			external: [
				"zod",
				"surrealdb",
			],
			output: {
				globals: {
					'zod': 'zod',
					'surrealdb': 'surrealdb',
				},
			},
		},
	},
}));