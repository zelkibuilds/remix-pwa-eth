import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import mkcert from "vite-plugin-mkcert";
import { remixPWA } from "@remix-pwa/dev";

export default defineConfig({
  server: {
    host: true,
  },
  plugins: [remix(), tsconfigPaths(), mkcert(), remixPWA()],
});
