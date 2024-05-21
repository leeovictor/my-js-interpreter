const globals = require("globals");
const pluginJs = require("@eslint/js");
const tseslint = require("typescript-eslint");

module.exports = tseslint.config(
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: ["eslint.config.js", "build"],
  },
);
