import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { commentAttrsPlugin } from "vite-plugin-comment-attrs";

export default defineConfig({
  plugins: [
    commentAttrsPlugin({
      directives: {
        "@class": { attr: "class", merge: "append" },
        "@id": { attr: "id", merge: "replace" },
        "@alt": { attr: "alt", merge: "replace" },
      },
    }),
    react(),
  ],
});
