import { cloudflareTest } from "@cloudflare/vitest-pool-workers";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Use vites apis as globals without importing
    globals: true,
    // Use higher timeout for e2e test
    testTimeout: 15_000,
  },
  plugins: [
    // Register wrangler environment
    cloudflareTest({
      wrangler: {
        configPath: "./wrangler.jsonc",
      },
    }),
  ],
});
