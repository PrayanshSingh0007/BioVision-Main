import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Relative base so the built app also runs from a plain folder / file:// URL.
export default defineConfig({
  plugins: [react()],
  base: "./",
  build: { chunkSizeWarningLimit: 900 },
});
