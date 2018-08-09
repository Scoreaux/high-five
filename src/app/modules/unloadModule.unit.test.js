import unloadModule from './unloadModule';

test('function returns true', async () => {
  const result = await unloadModule();

  expect(result).toBe(true);
});
