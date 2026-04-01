import nextConfig from "eslint-config-next";

const eslintConfig = [
  ...nextConfig,
  {
    ignores: [".next/**", "node_modules/**", "out/**", "coverage/**"],
  },
];

export default eslintConfig;
