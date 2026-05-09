import { defineConfig } from "vite";
import solid from "vite-plugin-solid";
import { commentAttrsPlugin } from "../../src";

export default defineConfig({
  plugins: [
    commentAttrsPlugin({
      directives: {
        "@class": { attr: "class", merge: "append" },
        "@id": { attr: "id", merge: "replace" },
        "@alt": { attr: "alt", merge: "replace" },
      },
    }),
    solid(),
  ],
});
