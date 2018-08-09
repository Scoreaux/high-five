import fs from 'fs';

import { logger, safeRequire } from 'app/utility';
import loadModule from './loadModule';

jest.mock('fs');
fs.stat.mockImplementation((_, callback) => {
  callback(null, {
    isDirectory: () => true,
  });
});

jest.mock('app/utility', () => ({
  safeRequire: jest.fn(),
  logger: {
    error: jest.fn(),
    info: jest.fn(),
  },
}));

beforeEach(() => {
  jest.clearAllMocks();

  // Add cache object to safeRequire so cached files can be removed
  safeRequire.cache = {};
});

test('Calling function with no file path logs an error', async () => {
  await loadModule();

  expect(logger.error).toBeCalledTimes(1);
});

test('Function logs an error if file path is a file', async () => {
  fs.stat.mockImplementationOnce((_, callback) => {
    callback(null, {
      isDirectory: () => false,
    });
  });
  await loadModule();

  expect(logger.error).toBeCalledTimes(1);
});

test('safeRequire() is called if the file path is a folder', async () => {
  await loadModule();

  expect(safeRequire).toBeCalledTimes(1);
});

test('Function logs an error if folder does not contain package.json', async () => {
  safeRequire.mockImplementationOnce(() => { throw new Error(''); });
  await loadModule();

  expect(logger.error).toBeCalledTimes(1);
});

test('Function logs an error if package.json does not have highFive key', async () => {
  safeRequire.mockImplementationOnce(() => ({}));
  await loadModule();

  expect(logger.error).toBeCalledTimes(1);
});

test('Function logs an error if package.json does not have highFive.type key', async () => {
  safeRequire.mockImplementationOnce(() => ({
    highFive: {}
  }));
  await loadModule();

  expect(logger.error).toBeCalledTimes(1);
});

test('Function logs an error if highFive.type key in package.json does not match types list', async () => {
  safeRequire.mockImplementationOnce(() => ({
    highFive: {
      type: 'causeTestFailure',
    }
  }));
  await loadModule();

  expect(logger.error).toBeCalledTimes(1);
});

test('Function logs an info message file matches module spec', async () => {
  safeRequire.mockImplementationOnce(() => ({
    highFive: {
      type: 'view',
    }
  }));
  await loadModule();

  expect(logger.info).toBeCalledTimes(1);
});
