import { isEqual } from 'lodash';

import paths from './paths';

test('Paths object includes expected keys', () => {
  expect(isEqual(Object.keys(paths), [
    'data',
    'config',
    'cache',
    'log',
    'temp',
    'modules',
  ])).toBe(true);
});
