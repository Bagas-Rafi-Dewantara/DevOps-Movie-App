/** @type {import('jest').Config} */
const config = {
  testEnvironment: "node",
  collectCoverageFrom: ["lib/**/*.js"],
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80,
    },
  },
};

module.exports = config;
