import isOSFile from './isOSFile';

test('Path to .DS_Store file created by macOS returns true', () => {
  const result = isOSFile('/Users/test/.DS_Store');

  expect(result).toBe(true);
});

test('Path to thumbs.db file created by Windows returns true', () => {
  const result = isOSFile('/Users/test/thumbs.db');

  expect(result).toBe(true);
});

test('Path to ethumbs.db file created by Windows returns true', () => {
  const result = isOSFile('/Users/test/ethumbs.db');

  expect(result).toBe(true);
});

test('Path to user created file returns false', () => {
  const result = isOSFile('/Users/test/aModule');

  expect(result).toBe(false);
});

test('No path provided returns false', () => {
  const result = isOSFile();

  expect(result).toBe(false);
});
