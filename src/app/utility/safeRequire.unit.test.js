global.__non_webpack_require__ = {};

beforeEach(() => {
  delete global.__webpack_require__;
  jest.resetModules();
});

test('Returns global.__non_webpack_require__ when __webpack_require__ global variable exists', () => {
  global.__webpack_require__ = () => {};
  const safeRequire = require.requireActual('./safeRequire').default;
  expect(safeRequire).toBe(global.__non_webpack_require__);
});

test('Returns default require when __webpack_require__ global variable does not exist', () => {
  const safeRequire = require.requireActual('./safeRequire').default;
  expect(JSON.stringify(safeRequire)).toEqual(JSON.stringify(require));
});
