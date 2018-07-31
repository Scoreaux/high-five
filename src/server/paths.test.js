import { isEqual } from 'lodash';

import paths from 'server/paths';

test('Paths object includes expected keys', () => {
  expect(isEqual(Object.keys(paths), [
    'data',
    'config',
    'cache',
    'log',
    'temp',
  ])).toBe(true);
});
