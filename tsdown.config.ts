import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/scripts/theme-loader.ts"],
  outDir: "public/scripts",
  format: ["iife"],
  minify: true,
  clean: true,
});
