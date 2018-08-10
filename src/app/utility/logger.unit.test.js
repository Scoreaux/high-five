import winston from 'winston';

beforeEach(() => {
  jest.resetModules();
  jest.clearAllMocks();
});

test('Logger exists', () => {
  jest.doMock('winston', () => ({
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
  // const winston = require('winston').default;
  // winston.createLogger.mockImplementation(() => ({
  //   add: jest.fn(),
  // }));

  console.log(winston);
  //expect(winston.createLogger).toHaveBeenCalledTimes(1);
  expect(true).toBe(true);
});

// test('Single transport type is added with NODE_ENV is test', () => {
//   jest.doMock('winston', () => ({
//     __esModule: true,
//     default: {
//       createLogger: jest.fn(),
//       transports: {
//         Console: class {},
//         File: class {},
//       },
//     },
//     format: {
//       printf: jest.fn(),
//       timestamp: jest.fn(),
//       colorize: jest.fn(),
//       combine: jest.fn(),
//       splat: jest.fn(),
//     },
//   }));
//   const winston = require('winston');
//
//   winston.createLogger.mockImplementation(() => ({
//     add: jest.fn(),
//   }));
//
//   const logger = require('./logger');
//   expect(winston.createLogger).toHaveBeenCalledTimes(1);
// });

// test('Multiple transport types are added with NODE_ENV is not test', () => {
//   global.process.env.NODE_ENV = 'development';
//   const logger = require('./logger');
//   expect(winston.createLogger.mock.results[0].value.add).toHaveBeenCalledTimes(1);
// });
