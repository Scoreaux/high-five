import fs from 'fs';

import { paths } from 'app/fs';
import loadModule from './loadModule';
import init from './init';

jest.mock('fs');
jest.mock('./loadModule');
jest.mock('./watchForChanges');

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

test('loadModule() is called for each non OS file returned by fs.readdir()', async () => {
  await init();

  expect(loadModule).toHaveBeenCalledWith(`${paths.modules}/${fileList[0]}`);
});
