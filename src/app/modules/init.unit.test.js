import fs from 'fs';

import { logger } from 'app/utility';
import ModuleManager from './ModuleManager';
import modules, { init } from './init';

jest.mock('./ModuleManager');
jest.mock('fs');

const fileList = ['file.txt', 'thumbs.db'];

fs.readdir.mockImplementation((_, callback) => {
  callback(null, fileList);
});

beforeEach(() => {
  jest.clearAllMocks();
  modules.list = [];
});

test('Default export returns ModuleManager instance', async () => {
  expect(modules instanceof ModuleManager).toBe(true);
});

test('Files in modules folder on load are read', async () => {
  await init();

  expect(fs.readdir).toHaveBeenCalledTimes(1);
});

test('Error reading files in modules folder logs an error', async () => {
  fs.readdir.mockImplementationOnce((_, callback) => {
    callback(new Error());
  });
  const logSpy = jest.spyOn(logger, 'error');

  await init();

  expect(logSpy).toHaveBeenCalledTimes(1);
});

test('Non OS files are added to ModuleManager instance', async () => {
  await init();

  expect(modules.add).toHaveBeenCalledTimes(1);
});
