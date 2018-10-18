import watch from 'node-watch';
import fs from 'fs';

import { paths } from 'app/fs';
import getModuleInfo from './getModuleInfo';
import ModuleManager from './ModuleManager.js';

const testPath = `${paths.modules}/testPath`;
const testModule = {
  name: 'testModule',
  type: 'source',
  path: testPath,
};

jest.mock('fs');
const fileList = ['file.txt', 'thumbs.db'];
fs.readdir.mockImplementation((_, callback) => {
  callback(null, fileList);
});

jest.mock('node-watch');
let hasClosed = false;
watch.mockImplementation(() => ({
  on: jest.fn(),
  close: () => {
    hasClosed = true;
  },
}));

const logger = jest.fn().mockImplementation(() => ({
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
}));

jest.mock('./getModuleInfo');
getModuleInfo.mockImplementation(() => testModule);

beforeEach(() => {
  jest.clearAllMocks();
  hasClosed = false;
});

describe('constructor()', () => {
  test('Class instance can be created with no errors', () => {
    const modules = new ModuleManager({ logger: logger() });

    expect(modules).toBeTruthy();
  });

  test('Providing modules prop to constructor sets list', () => {
    const modules = new ModuleManager({
      modules: [testModule],
      logger: logger(),
    });

    expect(modules.list).toContain(testModule);
  });

  test('Providing path prop to constructor sets path to modules folder', () => {
    const modules = new ModuleManager({
      path: testPath,
      logger: logger(),
    });

    expect(modules.path).toContain(testPath);
  });
});

describe('addInitialModules', () => {
  const modules = new ModuleManager({
    path: testPath,
    logger: logger(),
  });

  test('Files in modules folder on load are read', async () => {
    await modules.addInitialModules();

    expect(fs.readdir).toHaveBeenCalledTimes(1);
  });

  test('Error reading files in modules folder logs an error', async () => {
    fs.readdir.mockImplementationOnce((_, callback) => {
      callback(new Error());
    });

    await modules.addInitialModules();

    expect(modules.logger.error).toHaveBeenCalledTimes(1);
  });

  test('Non OS files are added to ModuleManager instance', async () => {
    const add = jest.spyOn(modules, 'add');
    await modules.addInitialModules();

    expect(add).toHaveBeenCalledTimes(1);
  });
});

describe('list', () => {
  test('Module list returns empty array', () => {
    const modules = new ModuleManager({ logger: logger() });

    expect(Array.isArray(modules.list)).toBe(true);
  });
});

describe('add()', () => {
  test('Returns null when the path is not a valid module', async () => {
    getModuleInfo.mockImplementationOnce(() => {
      throw new Error('');
    });
    const modules = new ModuleManager({ logger: logger() });
    const result = await modules.add(testPath);

    expect(result).toBe(null);
  });

  test('Returns module info object when the path is a valid module', async () => {
    const modules = new ModuleManager({ logger: logger() });
    const result = await modules.add(testPath);

    expect(result).toBe(testModule);
  });

  test('Module info object is added to list', async () => {
    const modules = new ModuleManager({ logger: logger() });
    await modules.add(testPath);

    expect(modules.list).toContain(testModule);
  });
});

describe('remove()', async () => {
  test('Returns true when a module is removed', async () => {
    const modules = new ModuleManager({ logger: logger() });
    await modules.add(testPath);
    const result = modules.remove(testPath);

    expect(result).toBe(true);
  });

  test('Returns false when no modules are removed', async () => {
    const modules = new ModuleManager({ logger: logger() });
    await modules.add(testPath);
    const result = modules.remove('another/path');

    expect(result).toBe(false);
  });

  test('Module is removed from list when remove() is called', async () => {
    const modules = new ModuleManager({ logger: logger() });
    await modules.add(testPath);
    modules.remove(testPath);

    expect(modules.list).not.toContain(testModule);
  });
});

describe('find()', async () => {
  test('Returns module with matching name property', async () => {
    const modules = new ModuleManager({ logger: logger() });
    await modules.add(testModule);
    const matchingModule = modules.find(testModule.name);
    expect(matchingModule).toMatchObject(testModule);
  });

  test('Returns null when no matching modules are found', () => {
    const modules = new ModuleManager({ logger: logger() });
    const matchingModule = modules.find('anotherName');
    expect(matchingModule).toBeFalsy();
  });
});

describe('watcher', () => {
  test('Creating class instance starts watcher', () => {
    const modules = new ModuleManager({ logger: logger() });
    expect(watch).toHaveBeenCalledTimes(1);
  });

  test('Watcher path matches modules path', () => {
    const modules = new ModuleManager({ logger: logger() });
    expect(watch).toHaveBeenCalledWith(modules.path);
  });

  test('Error is logged when watcher fails to start', () => {
    watch.mockImplementationOnce(() => {
      throw new Error();
    });
    const modules = new ModuleManager({ logger: logger() });
    expect(modules.logger.error).toHaveBeenCalledTimes(1);
  });

  test('Watcher subscribes to change events', () => {
    const modules = new ModuleManager({ logger: logger() });
    expect(modules.watcher.on).toHaveBeenCalledWith('change', expect.any(Function));
  });

  test('Change event of type update calls add() with file path', () => {
    const modules = new ModuleManager({ logger: logger() });
    modules.add = jest.fn();
    const onChange = modules.watcher.on.mock.calls[0][1];

    onChange('update', testPath);

    expect(modules.add).toHaveBeenCalledWith(testPath);
  });

  test('Change event of type update calls doesn\'t call add() when file path is an OS file', () => {
    const modules = new ModuleManager({ logger: logger() });
    modules.add = jest.fn();
    const onChange = modules.watcher.on.mock.calls[0][1];

    onChange('update', 'test/.DS_Store');

    expect(modules.add).not.toHaveBeenCalled();
  });

  test('Change event of type remove calls remove() with file path', () => {
    const modules = new ModuleManager({ logger: logger() });
    modules.remove = jest.fn();
    const onChange = modules.watcher.on.mock.calls[0][1];

    onChange('remove', testPath);

    expect(modules.remove).toHaveBeenCalledWith(testPath);
  });

  test('Change event of type remove calls doesn\'t call remove() when file path is an OS file', () => {
    const modules = new ModuleManager({ logger: logger() });
    modules.remove = jest.fn();
    const onChange = modules.watcher.on.mock.calls[0][1];

    onChange('remove', 'test/.DS_Store');

    expect(modules.remove).not.toHaveBeenCalled();
  });

  test('Change event of unknown type logs an error', () => {
    const modules = new ModuleManager({ logger: logger() });
    modules.remove = jest.fn();
    const onChange = modules.watcher.on.mock.calls[0][1];

    onChange('unknown', testPath);

    expect(modules.logger.error).toHaveBeenCalledTimes(1);
  });

  test('Error event is logged', () => {
    const modules = new ModuleManager({ logger: logger() });
    modules.remove = jest.fn();
    const onError = modules.watcher.on.mock.calls[1][1];

    onError(new Error('this is an error'));

    expect(modules.logger.error).toHaveBeenCalledTimes(1);
  });

  test('stopWatching() calls close() on existing watcher', () => {
    const modules = new ModuleManager({ logger: logger() });
    modules.stopWatching();

    expect(hasClosed).toBe(true);
  });

  test('stopWatching() Doesn\'t call close() when watcher doesn\'t exist', () => {
    const modules = new ModuleManager({ logger: logger() });
    modules.watcher = null;
    modules.stopWatching();

    expect(hasClosed).toBe(false);
  });

  test('stopWatching() removes watcher instance', () => {
    const modules = new ModuleManager({ logger: logger() });
    modules.stopWatching();

    expect(modules.watcher).toBeFalsy();
  });
});
