import { defineConfig } from "vite";
import solid from "vite-plugin-solid";
import path from "node:path";
import { fileURLToPath } from "node:url";
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
  const pluginModule = useLocalPlugin
    ? await import("../../src/index")
    : await import("vite-plugin-comment-attrs");

  logPlugin(
    `using ${useLocalPlugin ? "local source" : "npm package"}: ${
      useLocalPlugin ? localPluginPath : "vite-plugin-comment-attrs"
    }`,
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
