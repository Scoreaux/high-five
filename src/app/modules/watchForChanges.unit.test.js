import watch from 'node-watch';
import * as modules from './modules';
import watchForChanges from './watchForChanges';

jest.mock('node-watch');
jest.mock('./modules');

watch.mockImplementation(() => ({
  on: jest.fn(),
}));

afterEach(() => {
  jest.clearAllMocks();
});

test('Function subscribes to change events on watcher', () => {
  watchForChanges();
  const watcher = watch.mock.results[0].value;

  expect(watcher.on.mock.calls[0][0]).toBe('change');
});

test('Function returns watcher object', () => {
  const result = watchForChanges();

  expect(watch.mock.results[0].value).toBe(result);
});

test('Change event of type update calls loadModule() with updated file path', () => {
  const watcher = watchForChanges();
  const onChange = watcher.on.mock.calls[0][1];
  const filePath = '/test/path';

  onChange('update', filePath);

  expect(modules.loadModule.mock.calls[0][0]).toBe(filePath);
});

test('Change event of type update with OS file does not call loadModule()', () => {
  const watcher = watchForChanges();
  const onChange = watcher.on.mock.calls[0][1];
  const filePath = '/test/.DS_Store';

  onChange('update', filePath);

  expect(modules.loadModule).not.toHaveBeenCalled();
});

test('Change event of type remove calls unloadModule() with updated file path', () => {
  const watcher = watchForChanges();
  const onChange = watcher.on.mock.calls[0][1];
  const filePath = '/test/path';

  onChange('remove', filePath);

  expect(modules.unloadModule.mock.calls[0][0]).toBe(filePath);
});

test('Change event of type remove with OS file does not call unloadModule', () => {
  const watcher = watchForChanges();
  const onChange = watcher.on.mock.calls[0][1];
  const filePath = '/test/.DS_Store';

  onChange('remove', filePath);

  expect(modules.loadModule).not.toHaveBeenCalled();
});

test('Change event of unknown type results in no action', () => {
  const watcher = watchForChanges();
  const onChange = watcher.on.mock.calls[0][1];
  const filePath = '/test/.DS_Store';

  onChange('test', filePath);

  expect(modules.loadModule).not.toHaveBeenCalled();
  expect(modules.unloadModule).not.toHaveBeenCalled();
});
