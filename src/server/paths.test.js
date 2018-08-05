import { isEqual } from 'lodash';
import fs from 'fs';

import paths, { createFolder } from 'server/paths';

test('Paths object includes expected keys', () => {
  expect(isEqual(Object.keys(paths), [
    'data',
    'config',
    'cache',
    'log',
    'temp',
    'modules',
  ])).toBe(true);
});

beforeEach(() => {
  jest.mock('fs');
});

afterEach(() => {
  jest.clearAllMocks();
});

jest.mock('fs');

fs.mkdir.mockImplementation((_, callback) => { callback(); });

describe('createFolder()', () => {
  test('Folder is created if it doesnt exist', async () => {
    fs.access.mockImplementationOnce((_, callback) => {
      callback('error!');
    });

    await createFolder(paths.log);

    expect(fs.mkdir.mock.calls.length).toBe(1);
  });

  test('Folder is not created if it already exists', async () => {
    fs.access.mockImplementationOnce((_, callback) => {
      callback();
    });

    await createFolder(paths.log);

    expect(fs.mkdir.mock.calls.length).toBe(0);
  });

  test('Failure to create folder throws error', async () => {
    fs.access.mockImplementationOnce((_, callback) => {
      callback(new Error('FAIL'));
    });
    fs.mkdir.mockImplementationOnce((_, callback) => { callback('error!'); });

    const result = await createFolder(paths.log);

    expect(result).toBe(false);
  });
});
