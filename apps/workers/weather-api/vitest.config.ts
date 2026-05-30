import { defineConfig, mergeConfig } from "vitest/config";

import workersConfig from "../vitest.workers.config";

export default mergeConfig(workersConfig, defineConfig({}));
