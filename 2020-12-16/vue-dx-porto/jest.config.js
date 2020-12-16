module.exports = {
  preset: 'ts-jest',
  globals: {
    "vue-jest": {
      // "tsConfig": "./tsconfig.json"
    }
  },
  testEnvironment: 'jsdom',
  transform: {
    "^.+\\.vue$": "vue-jest",
    "^.+\\js$": "babel-jest"
  },
  moduleFileExtensions: ['vue', 'js', 'json', 'jsx', 'ts', 'tsx', 'node'],
  testMatch: ["<rootDir>src/__tests__/**/*spec.[jt]s?(x)"]
}