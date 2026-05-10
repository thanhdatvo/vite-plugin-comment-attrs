import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { existsSync } from "node:fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const localPluginPath = path.resolve(__dirname, "../../src/index.ts");
const useLocalPlugin = existsSync(localPluginPath);

function logPlugin(message: string) {
  const time = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  }).format(new Date());

  const prefix = "\x1b[1m\x1b[36m[vite-plugin-comment-attrs]\x1b[0m";

  console.log(`${time} ${prefix} ${message}`);
}

export default defineConfig(async () => {
  const pluginImportPath = useLocalPlugin
    ? pathToFileURL(localPluginPath).href
    : "vite-plugin-comment-attrs";

  const pluginModule = await import(/* @vite-ignore */ pluginImportPath);

  logPlugin(
    `using ${useLocalPlugin ? "local source" : "npm package"}: ${
      useLocalPlugin ? localPluginPath : "vite-plugin-comment-attrs"
    }`,
  );

  return {
    plugins: [
      pluginModule.commentAttrsPlugin({
        directives: {
          "@class": { attr: "className", merge: "append" },
          "@id": { attr: "id", merge: "replace" },
          "@alt": { attr: "alt", merge: "replace" },
        },
      }),
      react(),
    ],
  };
});
