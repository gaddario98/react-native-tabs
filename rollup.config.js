import { createRequire } from "module";
import { createReactNativeConfig } from "../../rollup.common.config.js";

const require = createRequire(import.meta.url);
const pkg = require("./package.json");

// Utilizziamo la configurazione ottimizzata per pacchetti React Native
export default createReactNativeConfig(pkg);
