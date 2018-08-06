import createAllFolders from './createAllFolders';
import createFolder from './createFolder';

jest.mock('./createFolder');

test('No folder creation failures returns true', async () => {
  createFolder.mockResolvedValue(true);

  const result = await createAllFolders();

  expect(result).toBe(true);
});

test('Any folder creation failures returns false', async () => {
  createFolder.mockResolvedValueOnce(false);
  createFolder.mockResolvedValue(true);

  const result = await createAllFolders();

  expect(result).toBe(false);
});
