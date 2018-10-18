import createAllFolders from './createAllFolders';
import createFolder from './createFolder';

jest.mock('./createFolder');

const mockPaths = {
  modules: 'path/to/modules',
};

test('No folder creation failures returns true', async () => {
  createFolder.mockResolvedValue(true);

  const result = await createAllFolders(mockPaths);

  expect(result).toBe(true);
});

test('Any folder creation failures returns false', async () => {
  createFolder.mockResolvedValueOnce(false);
  createFolder.mockResolvedValue(true);

  const result = await createAllFolders(mockPaths);

  expect(result).toBe(false);
});

test('createFolder() is called with the correct path', async () => {
  await createAllFolders(mockPaths);

  expect(createFolder).toHaveBeenCalledWith(mockPaths.modules);
});
