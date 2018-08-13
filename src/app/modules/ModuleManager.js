import watch from 'node-watch';

import { logger, isOSFile } from 'app/utility';
import { paths } from 'app/fs';
import getModuleInfo from './getModuleInfo';

class ModuleManager {
  constructor({ modules = [], path = paths.modules } = {}) {
    logger.info('Module manager created');

    this.list = modules;
    this.path = path;

    this.startWatching();
  }

  async add(path) {
    try {
      const module = await getModuleInfo(path);
      this.list.push(module);
      logger.info(`Added module: ${module.name}`);
      return module;
    } catch (error) {
      logger.error('Couldn\'t add module', error);
      return false;
    }
  }

  remove(path) {
    const listLength = this.list.length;
    this.list = this.list.filter(item => item.path !== path);
    if (listLength > this.list.length) {
      logger.info(`Removed module at path: ${path}`);
      return true;
    }
    logger.error(`Couldn't remove module, no matching module was found (${path})`);
    return false;
  }

  find(name) {
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
