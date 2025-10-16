import { createRequire } from "module";
import { createReactNativeConfig } from "../../rollup.common.config.js";

const require = createRequire(import.meta.url);
const pkg = require("./package.json");

// Utilizziamo direttamente la configurazione semplificata per pacchetti React Native
export default createReactNativeConfig(pkg);
