/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: "ts-jest/presets/js-with-ts-esm",
  testEnvironment: "node",
  moduleDirectories: ["node_modules", "src"],
  transform: {
    "^.+\\.(tsv|inv)$": "<rootDir>/src/utils/dataTransformer.js",
  },
};
