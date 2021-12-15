const path = require('path');

/** @type {import('@jest/types').Config.InitialOptions} */
const config = {
  verbose: true,
  collectCoverage: true,
  setupFiles: [path.resolve(__dirname, 'jestSetEnv.js')],
};

module.exports = config;