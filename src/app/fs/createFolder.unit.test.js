import fs from 'fs';

import paths from './paths';
import createFolder from './createFolder';


jest.mock('fs');
fs.mkdir.mockImplementation((_, callback) => { callback(); });

afterEach(() => {
  jest.clearAllMocks();
});

test('Folder is created if it doesnt exist', async () => {
  fs.access.mockImplementationOnce((_, callback) => {
    callback('error!');
  });

  await createFolder(paths.log);

  expect(fs.mkdir).toHaveBeenCalledTimes(1);
});

test('Folder is not created if it already exists', async () => {
  fs.access.mockImplementationOnce((_, callback) => {
    callback();
  });

  await createFolder(paths.log);

  expect(fs.mkdir).not.toHaveBeenCalled();
});

test('Failure to create folder throws error', async () => {
  fs.access.mockImplementationOnce((_, callback) => {
    callback(new Error('FAIL'));
  });
  fs.mkdir.mockImplementationOnce((_, callback) => { callback('error!'); });

  const result = await createFolder(paths.log);

  expect(result).toBe(false);
});
