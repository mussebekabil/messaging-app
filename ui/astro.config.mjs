import { defineConfig } from "astro/config";

// https://astro.build/config
import react from "@astrojs/react";

// https://astro.build/config
// import netlify from "@astrojs/netlify/functions";

// https://astro.build/config
export default defineConfig({
  server: {
    port: 7778,
    host: "0.0.0.0"
  },
  integrations: [react()],
  output: 'server' // enable SSR for dynamic routing
  // ,adapter: netlify()
});
