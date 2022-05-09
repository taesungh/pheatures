/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleDirectories: ["node_modules", "src"],
  transform: {
    "^.+\\.(tsv|inv)$": "<rootDir>/src/utils/dataTransformer.js",
  },
};