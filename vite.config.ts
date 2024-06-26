import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { VitePWA } from "vite-plugin-pwa";
import tsconfigPaths from "vite-tsconfig-paths";
import svg from "@poppanator/sveltekit-svg";
import webManifest from "./web_manifest.json";

type PluginConfigLike = {
  name: string;
  type: string;
  fn: () => {
    element: {
      enter: (node: {
        attributes: Record<string, string>;
        name: string;
      }) => void;
    };
  };
};

const changeToCurrentColor: PluginConfigLike = {
  name: "Rename fill to currentColor",
  type: "",
  fn: () => ({
    element: {
      enter: (node) => {
        if (node.attributes["stroke"]) {
          node.attributes["stroke"] = "currentColor";
        }

        if (node.attributes["fill"] === "none") {
          return;
        }

        if (node.attributes["fill"] || node.name === "svg")
          node.attributes["fill"] = "currentColor";
      },
    },
  }),
};

// https://vitejs.dev/config/
export default defineConfig({
  base: "/food_control/",
  plugins: [
    svelte(),
    svg({
      svgoOptions: {
        plugins: [
          {
            name: "preset-default",
            // by default svgo removes the viewBox which prevents svg icons from scaling
            // not a good idea! https://github.com/svg/svgo/pull/1461
            params: { overrides: { removeViewBox: false } },
          },
          {
            name: "removeAttrs",
            params: { attrs: "(width|height)" },
          },
          changeToCurrentColor,
        ],
      },
    }),
    tsconfigPaths(),
    VitePWA({
      registerType: "autoUpdate",
      ...webManifest,
    }),
  ],
});
