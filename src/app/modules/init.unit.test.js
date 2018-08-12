import fs from 'fs';

import init from './init';

jest.mock('./ModuleManager');

jest.mock('fs');

const fileList = ['file.txt', 'thumbs.db'];

fs.readdir.mockImplementation((_, callback) => {
  callback(null, fileList);
});

beforeEach(() => {
  jest.clearAllMocks();
});

test('Function returns true when no error occurs reading modules directory', async () => {
  const result = await init();

  expect(result).toBe(true);
});

test('Function returns false when error occurs reading modules directory', async () => {
  fs.readdir.mockImplementationOnce((_, callback) => {
    callback('error');
  });

  const result = await init();

  expect(result).toBe(false);
});
