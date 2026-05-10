import { defineConfig } from "vite";
import solid from "vite-plugin-solid";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import logPlugin from "../utils/log";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const isStackBlitz = !!process.env.STACKBLITZ;

export default defineConfig(async () => {
  const pluginModule = isStackBlitz
    ? await import("vite-plugin-comment-attrs")
    : await import("../../src/index");

  const pluginSource = isStackBlitz
    ? require.resolve("vite-plugin-comment-attrs")
    : path.resolve(__dirname, "../../src/index.ts");

  logPlugin(
    ` using ${isStackBlitz ? "npm package" : "local source"}: ${pluginSource}`,
  );

  return {
    plugins: [
      pluginModule.commentAttrsPlugin({
        directives: {
          "@class": { attr: "class", merge: "append" },
          "@id": { attr: "id", merge: "replace" },
          "@alt": { attr: "alt", merge: "replace" },
        },
      }),
      solid(),
    ],
  };
});
