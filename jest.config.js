// eslint-disable-next-line no-undef
module.exports = {
  verbose: true,
  maxWorkers: 1,
  collectCoverage: true,
  collectCoverageFrom: ["src/**/*.ts", "sample/**/*.ts"],
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],
};
