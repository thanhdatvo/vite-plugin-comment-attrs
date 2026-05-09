import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { commentAttrsPlugin } from "../../src";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    commentAttrsPlugin({
      directives: {
        "@class": { attr: "className", merge: "append" },
        "@id": { attr: "id", merge: "replace" },
        "@alt": { attr: "alt", merge: "replace" },
      },
    }),
    react(),
  ],
});
