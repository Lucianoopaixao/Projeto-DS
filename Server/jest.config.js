export default {
  testEnvironment: "node",

  // Corrige imports relativos com .js em ES Modules
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1"
  }
};
