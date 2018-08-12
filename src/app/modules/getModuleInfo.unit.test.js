import fs from 'fs';

import { safeRequire } from 'app/utility';
import getModuleInfo from './getModuleInfo';

jest.mock('fs');
fs.stat.mockImplementation((_, callback) => {
  callback(null, {
    isDirectory: () => true,
  });
});

jest.mock('app/utility', () => ({
  safeRequire: jest.fn(),
}));

beforeEach(() => {
  jest.clearAllMocks();

  // Add cache object to safeRequire so cached files can be removed
  safeRequire.cache = {};
});

test('Function throws an error if the path is not a directory', async () => {
  fs.stat.mockImplementationOnce((_, callback) => {
    callback(null, {
      isDirectory: () => false,
    });
  });

  expect(getModuleInfo()).rejects.toThrow();
});

test('safeRequire() is called if the path is a folder', async () => {
  try {
    await getModuleInfo();
  } catch (error) {
    // Do nothing
  }

  expect(safeRequire).toBeCalledTimes(1);
});

test('Function throws an error if path does not contain package.json', async () => {
  safeRequire.mockImplementationOnce(() => { throw new Error(''); });

  expect(getModuleInfo()).rejects.toThrow();
});

test('Function throws an error if package.json does not have highFive key', async () => {
  safeRequire.mockImplementationOnce(() => ({}));

  expect(getModuleInfo()).rejects.toThrow();
});

test('Function throws an error if package.json does not have highFive.type key', async () => {
  safeRequire.mockImplementationOnce(() => ({
    highFive: {}
  }));

  expect(getModuleInfo()).rejects.toThrow();
});

test('Function throws an error if highFive.type key in package.json does not match types list', async () => {
  safeRequire.mockImplementationOnce(() => ({
    highFive: {
      type: 'causeTestFailure',
    }
  }));

  expect(getModuleInfo()).rejects.toThrow();
});

test('Function returns module info object if the path matches module spec', async () => {
  const packageJson = {
    name: 'viewModule',
    highFive: {
      type: 'view',
    },
  };
  safeRequire.mockImplementationOnce(() => packageJson);
  const result = await getModuleInfo('test/path');

  expect(result).toMatchObject(packageJson);
});
