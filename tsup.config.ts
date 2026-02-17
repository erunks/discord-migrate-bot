import { defineConfig } from "tsup";

export default defineConfig({
  clean: true,
  dts: false,
  format: ["esm"],
  loader: {
    ".prisma": "file",
    ".sql": "file",
    ".toml": "file",
  },
  outDir: "build",
});