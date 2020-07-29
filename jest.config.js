// eslint-disable-next-line no-undef
module.exports = {
  verbose: false,
  maxWorkers: 1,
  collectCoverage: true,
  collectCoverageFrom: ["src/**/*.ts", "sample/**/*.ts"],
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],
};
