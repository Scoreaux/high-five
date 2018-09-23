// @flow

import watch from 'node-watch';

import { logger, isOSFile } from 'app/utility';
import { paths } from 'app/fs';
import getModuleInfo from './getModuleInfo';
import { type ModuleDefinition } from './types';

type ConstructorArgs = {
  modules: Array<ModuleDefinition>,
  path: string,
}

class ModuleManager {
  list: Array<ModuleDefinition>;

  watcher: watch;

  path: string;

  constructor({ modules = [], path = paths.modules }: ConstructorArgs = {}): void {
    logger.info('Module manager created');

    this.list = modules;
    this.path = path;

    this.startWatching();
  }

  async add(path: string = ''): Promise<?ModuleDefinition> {
    try {
      const module: ModuleDefinition = await getModuleInfo(path);
      this.list.push(module);
      logger.info(`Added module: ${module.name}`);
      return module;
    } catch (error) {
      logger.error('Couldn\'t add module', error);
      return null;
    }
  }

  remove(path: string) {
    const listLength = this.list.length;
    this.list = this.list.filter(item => item.path !== path);
    if (listLength > this.list.length) {
      logger.info(`Removed module at path: ${path}`);
      return true;
    }
    logger.error(`Couldn't remove module, no matching module was found (${path})`);
    return false;
  }

  find(name: string) {
    return this.list.find(item => item.name === name);
  }

  startWatching() {
    try {
      this.watcher = watch(this.path);

      this.watcher.on('change', (e, path) => {
        if (e === 'update') {
          if (!isOSFile(path)) {
            // File has been updated/created, load/reload module
            this.add(path);
          }
        } else if (e === 'remove') {
          if (!isOSFile(path)) {
            this.remove(path);
          }
        } else {
          logger.error(`Unknown change event of type ${e} occurred`);
        }
      });

      this.watcher.on('error', (error) => {
        logger.error('An error occurred watching for changes in modules folder', error);
      });
    } catch (error) {
      logger.error('An error occurred starting watcher on modules folder', error);
    }
  }

  stopWatching() {
    if (this.watcher) {
      this.watcher.close();
    }
    this.watcher = null;
  }
}

export default ModuleManager;
