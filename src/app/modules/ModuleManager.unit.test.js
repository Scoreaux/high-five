import watch from 'node-watch';

import { logger } from 'app/utility';
import { paths } from 'app/fs';
import getModuleInfo from './getModuleInfo';
import ModuleManager from './ModuleManager.js';

const testPath = `${paths.modules}/testPath`;
const testModule = {
  name: 'testModule',
  type: 'source',
  path: testPath,
};

jest.mock('node-watch');
watch.mockImplementation(() => ({
  on: jest.fn(),
  close: jest.fn(),
}));

jest.mock('./getModuleInfo');
getModuleInfo.mockImplementation(() => testModule);

beforeEach(() => {
  jest.clearAllMocks();
});

describe('constructor()', () => {
  test('Class instance can be created with no errors', () => {
    const modules = new ModuleManager();

    expect(modules).toBeTruthy();
  });

  test('Providing modules prop to constructor sets list', () => {
    const modules = new ModuleManager({
      modules: [testModule],
    });

    expect(modules.list).toContain(testModule);
  });

  test('Providing path prop to constructor sets path to modules folder', () => {
    const modules = new ModuleManager({
      path: testPath,
    });

    expect(modules.path).toContain(testPath);
  });
});

describe('list', () => {
  test('Module list returns empty array', () => {
    const modules = new ModuleManager();

    expect(Array.isArray(modules.list)).toBe(true);
  });
});

describe('add()', () => {
  test('Returns false when the path is not a valid module', async () => {
    getModuleInfo.mockImplementationOnce(() => {
      throw new Error('');
    });
    const modules = new ModuleManager();
    const result = await modules.add(testPath);

    expect(result).toBe(false);
  });

  test('Returns module info object when the path is a valid module', async () => {
    const modules = new ModuleManager();
    const result = await modules.add(testPath);

    expect(result).toBe(testModule);
  });

  test('Module info object is added to list', async () => {
    const modules = new ModuleManager();
    await modules.add(testPath);

    expect(modules.list).toContain(testModule);
  });
});

describe('remove()', async () => {
  test('Returns true when a module is removed', async () => {
    const modules = new ModuleManager();
    await modules.add(testPath);
    const result = modules.remove(testPath);

    expect(result).toBe(true);
  });

  test('Returns false when no modules are removed', async () => {
    const modules = new ModuleManager();
    await modules.add(testPath);
    const result = modules.remove('another/path');

    expect(result).toBe(false);
  });

  test('Module is removed from list when remove() is called', async () => {
    const modules = new ModuleManager();
    await modules.add(testPath);
    modules.remove(testPath);

    expect(modules.list).not.toContain(testModule);
  });
});

describe('find()', async () => {
  test('Returns module with matching name property', async () => {
    const modules = new ModuleManager();
    await modules.add(testModule);
    const matchingModule = modules.find(testModule.name);
    expect(matchingModule).toMatchObject(testModule);
  });

  test('Returns null when no matching modules are found', () => {
    const modules = new ModuleManager();
    const matchingModule = modules.find('anotherName');
    expect(matchingModule).toBeFalsy();
  });
});

describe('watcher', () => {
  test('Creating class instance starts watcher', () => {
    const modules = new ModuleManager();
    expect(watch).toHaveBeenCalledTimes(1);
  });

  test('Watcher path matches modules path', () => {
    const modules = new ModuleManager();
    expect(watch).toHaveBeenCalledWith(modules.path);
  });

  test('Error is logged when watcher fails to start', () => {
    watch.mockImplementationOnce(() => {
      throw new Error();
    });
    const logSpy = jest.spyOn(logger, 'error');
    const modules = new ModuleManager();
    expect(logSpy).toHaveBeenCalledTimes(1);
  });

  test('Watcher subscribes to change events', () => {
    const modules = new ModuleManager();
    expect(modules.watcher.on).toHaveBeenCalledWith('change', expect.any(Function));
  });

  test('Change event of type update calls add() with file path', () => {
    const modules = new ModuleManager();
    modules.add = jest.fn();
    const onChange = modules.watcher.on.mock.calls[0][1];

    onChange('update', testPath);

    expect(modules.add).toHaveBeenCalledWith(testPath);
  });

  test('Change event of type remove calls remove() with file path', () => {
    const modules = new ModuleManager();
    modules.remove = jest.fn();
    const onChange = modules.watcher.on.mock.calls[0][1];

    onChange('remove', testPath);

    expect(modules.remove).toHaveBeenCalledWith(testPath);
  });

  test('Change event of unknown type logs an error', () => {
    const modules = new ModuleManager();
    modules.remove = jest.fn();
    const onChange = modules.watcher.on.mock.calls[0][1];
    const logSpy = jest.spyOn(logger, 'error');

    onChange('unknown', testPath);

    expect(logSpy).toHaveBeenCalledTimes(1);
  });

  test('Error event is logged', () => {
    const modules = new ModuleManager();
    modules.remove = jest.fn();
    const onError = modules.watcher.on.mock.calls[1][1];

    const logSpy = jest.spyOn(logger, 'error');

    onError(new Error('this is an error'));

    expect(logSpy).toHaveBeenCalledTimes(1);
  });

  test('stopWatching() clears watcher', () => {
    const modules = new ModuleManager();
    modules.stopWatching();

    expect(modules.watcher).toBeFalsy();
  });
});
