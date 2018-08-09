import winston from 'winston';

jest.mock('winston', () => ({
  __esModule: true,
  default: {
    createLogger: jest.fn(),
    transports: {
      Console: class {},
      File: class {},
    },
  },
  format: {
    printf: jest.fn(),
    timestamp: jest.fn(),
    colorize: jest.fn(),
    combine: jest.fn(),
    splat: jest.fn(),
  },
}));

winston.createLogger.mockImplementation(() => ({
  add: jest.fn(),
}));

afterEach(() => {
  jest.resetModules();
});

test('Logger exists', () => {
  const logger = require('./logger');
  expect(winston.createLogger).toHaveBeenCalledTimes(1);
});

// test('Single transport type is added with NODE_ENV is test', () => {
//   const logger = require('./logger');
//   expect(winston.createLogger.mock.results[0].value.add).toHaveBeenCalledTimes(1);
// });

// test('Multiple transport types are added with NODE_ENV is not test', () => {
//   global.process.env.NODE_ENV = 'development';
//   const logger = require('./logger');
//   expect(winston.createLogger.mock.results[0].value.add).toHaveBeenCalledTimes(1);
// });
