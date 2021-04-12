const { compilerOptions } = require('./tsconfig.json')
const { pathsToModuleNameMapper } = require('ts-jest/utils')

module.exports = {
  clearMocks: true,
  collectCoverageFrom: [
    '**/*.{js,ts}',
    '!**/*.d.ts',  //  Exclude all type declaration files
    '!**/*.test.{js,ts,tsx}',  // Exclude test files
    '!**/*.spec.{js,ts,tsx}', // Exclude test files
    '!**/node_modules/**',  //  Exclude all files in node_modules
    '!**/dist/**'  //  Exclude all files in the dist folder
  ],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>' }),
  testPathIgnorePatterns: ['/node_modules/', '/build/'],
  transformIgnorePatterns: [
    '/node_modules/',
  ],
  transform: {
    '^.+\\.(js|ts)$': 'ts-jest'
  },
  preset: 'ts-jest',
  testEnvironment: 'node'
}
