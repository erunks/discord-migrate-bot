import { defineConfig } from "tsup";

export default defineConfig({
  clean: true,
  format: ["esm"],
  dts: false,
  outDir: "build",
});