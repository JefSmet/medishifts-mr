/**
 * @see https://prettier.io/docs/en/configuration.html
 * @type {import("prettier").Config}
 */
const config = {
  tabWidth: 2,
  semi: true,
  singleQuote: true,
  trailingComma: 'all',
  bracketSpacing: true,
  bracketSameLine: false,
  arrowParens: 'always',
  printWidth: 80,
  endOfLine: 'auto',
  plugins: ['prettier-plugin-tailwindcss', '@prettier/plugin-xml'],
  xmlWhitespaceSensitivity: 'ignore',
};

export default config;
