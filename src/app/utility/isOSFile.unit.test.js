import isOSFile from './isOSFile';

test('Path to a file created by macOS returns true', () => {
  const result = isOSFile('/Users/test/.DS_Store');

  expect(result).toBe(true);
});

test('Path to a file created by Windows returns true', () => {
  const result = isOSFile('/Users/test/thumbs.db');

  expect(result).toBe(true);
});

test('Path to user created file returns false', () => {
  const result = isOSFile('/Users/test/aModule');

  expect(result).toBe(false);
});
