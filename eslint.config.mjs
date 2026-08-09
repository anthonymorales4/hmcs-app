import nextCoreWebVitals from "eslint-config-next/core-web-vitals";

// eslint-config-next 16 ships a real flat config, so it is imported directly.
// The previous setup wrapped it in FlatCompat from @eslint/eslintrc, which was
// the eslintrc-to-flat shim needed by v15. Against v16 that shim throws
// "Converting circular structure to JSON" while normalizing the config.
const eslintConfig = [
  ...nextCoreWebVitals,
  { ignores: [".next/**", "out/**", "build/**", "node_modules/**"] },
];

export default eslintConfig;
