module.exports = {
  testEnvironment: 'node',
  clearMocks: true,
  coverageDirectory: 'coverage',
  collectCoverageFrom: ['src/**/*.js'],
  coveragePathIgnorePatterns: [
    'node_modules',
    'coverage',
    'src/seeders',
    'src/index.js',
    'src/app.js',
    'src/helpers/logger.js',
    'src/models/index.js',
    'src/middlewares/joiErrors.js',
    'src/middlewares/asyncHandler.js',
    'src/middlewares/registerEvents.js',
    'src/config',
    'src/constants',
    'src/helpers/sendMail.js',
    'src/helpers/mailer.js',
  ],
  verbose: true,
  coverageThreshold: {
    global: {
      functions: 80,
      lines: 80,
      statements: -20,
    },
  },
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
  },
};
