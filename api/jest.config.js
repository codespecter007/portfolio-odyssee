/** Tests de l’API : unitaires (*.spec.ts) et de bout en bout (test/*.e2e-spec.ts). */
module.exports = {
  moduleFileExtensions: ["js", "json", "ts"],
  testRegex: ".*\\.(spec|e2e-spec)\\.ts$",
  transform: { "^.+\\.ts$": "ts-jest" },
  testEnvironment: "node",
};
