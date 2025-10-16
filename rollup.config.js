import peerDepsExternal from "rollup-plugin-peer-deps-external";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import typescript from "@rollup/plugin-typescript";
import babel from "@rollup/plugin-babel";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const pkg = require("./package.json");

// Plugin to remove 'use client', 'use server', and 'worklet' directives
const removeDirectives = () => ({
  name: 'remove-directives',
  transform(code, id) {
    if (id.includes('node_modules')) {
      const newCode = code
        .replace(/['"]use (client|server)['"];?\s*/g, '')
        .replace(/['"]worklet['"];?\s*/g, '');
      if (newCode !== code) {
        return { code: newCode, map: null };
      }
    }
    return null;
  }
});

// Extra externals that might not be declared as peer deps but should not be bundled
const extraExternal = [
  "react",
  "react/jsx-runtime",
  "react-native",
  "expo-linear-gradient",
  "expo-router",
  "@expo/vector-icons",
  "@react-native-community/datetimepicker",
  "react-native-reanimated",
  "react-native-worklets",
  "react-native-gesture-handler",
];

const dependencyNames = [
  ...Object.keys(pkg.peerDependencies ?? {}),
];

const isExternal = (id) => {
  // External: peer dependencies
  if (dependencyNames.some(
    (depName) => id === depName || id.startsWith(`${depName}/`)
  )) {
    return true;
  }
  
  // External: extra external packages
  if (extraExternal.some(
    (depName) => id === depName || id.startsWith(`${depName}/`)
  )) {
    return true;
  }
  
  // External: moduli nativi React Native comuni
  if (id.startsWith('react-native/') || 
      id === 'react-native' ||
      id.startsWith('@react-native/') ||
      id.startsWith('@react-native-community/') ||
      id.startsWith('expo/') ||
      id.startsWith('expo-') ||
      id.startsWith('@expo/') ||
      id === 'expo') {
    return true;
  }
  
  return false;
};

// Centralized warning handler
const handleWarning = (warning, warn) => {
  // Ignore 'THIS_IS_UNDEFINED' warnings
  if (warning.code === "THIS_IS_UNDEFINED") return;
  
  // Ignore 'UNRESOLVED_IMPORT' for known external packages
  if (warning.code === "UNRESOLVED_IMPORT") {
    const unresolved = warning.source;
    if (
      unresolved === "react-native-worklets" ||
      unresolved?.startsWith("react-native-reanimated") ||
      unresolved?.startsWith("expo-") ||
      unresolved?.startsWith("@expo/")
    ) {
      return;
    }
  }
  
  // Ignore 'MODULE_LEVEL_DIRECTIVE' for worklet directives
  if (
    warning.code === "MODULE_LEVEL_DIRECTIVE" &&
    warning.message?.includes("worklet")
  ) {
    return;
  }
  
  // Ignore circular dependencies in third-party packages
  if (
    warning.code === "CIRCULAR_DEPENDENCY" &&
    warning.ids?.some(id => id.includes("node_modules"))
  ) {
    return;
  }
  
  warn(warning);
};

export default {
  input: "index.ts",
  output: [
    // ESM build
    {
      file: "dist/index.mjs",
      format: "esm",
      sourcemap: true,
      exports: "named",
    },
    // CommonJS build per React Native
    {
      file: "dist/index.js",
      format: "cjs",
      sourcemap: true,
      exports: "named",
    },
  ],
  external: isExternal,
  plugins: [
    removeDirectives(),
    peerDepsExternal(),
    resolve({
      preferBuiltins: false,
      extensions: [".tsx", ".ts", ".jsx", ".js", ".json"],
      browser: true,
    }),
    json(),
    commonjs(),
    typescript({
      tsconfig: "./tsconfig.json",
      declaration: true,
      declarationDir: "dist",
      rootDir: "./",
    }),
    babel({
      extensions: [".js", ".jsx", ".ts", ".tsx"],
      plugins: ["babel-plugin-react-compiler"],
      babelHelpers: "bundled",
      exclude: "node_modules/**",
    }),
  ],
  onwarn: handleWarning,
};
