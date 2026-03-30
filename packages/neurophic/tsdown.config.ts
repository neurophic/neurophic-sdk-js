import { defineConfig } from "tsdown";
import { readFileSync } from "node:fs";

const pkg = JSON.parse(readFileSync("./package.json", "utf-8"));

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  sourcemap: true,
  define: {
    __VERSION__: JSON.stringify(pkg.version),
  },
});
