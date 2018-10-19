// @flow strict

import watch from 'node-watch';
import type { Logger } from 'winston';
import fs from 'fs';
import { promisify } from 'util';
import { PubSub } from 'graphql-subscriptions';

import { isOSFile } from 'app/utility';
import getModuleInfo from './getModuleInfo';
import { type ModuleDefinition } from './types';

type ConstructorArgs = {
  modules: Array<ModuleDefinition>,
  path: string,
  logger: Logger,
  pubsub?: PubSub,
}

class ModuleManager {
  list: Array<ModuleDefinition>;

  watcher: watch;

  path: string;

  logger: Logger;

  pubsub: PubSub;

  constructor({
    modules = [],
    path,
    logger,
    pubsub
  }: ConstructorArgs = {}): void {
    this.list = modules;
    this.path = path;
    this.logger = logger;
    this.pubsub = pubsub;

    this.logger.info('Module manager created');

    this.addInitialModules();

    this.startWatching();
  }

  async add(path: string = ''): Promise<?ModuleDefinition> {
    try {
      const module: ModuleDefinition = await getModuleInfo(path);
      this.list.push(module);
      this.logger.info(`Added module: ${module.name}`);
      // Publish pubsub event with added module
      this.pubsub.publish('modulesUpdated', {
        modulesUpdated: [{
          name: module.name,
        }],
      });
      return module;
    } catch (error) {
      this.logger.error('Couldn\'t add module', error);
      return null;
    }
  }

  remove(path: string): boolean {
    const listLength = this.list.length;
    this.list = this.list.filter(item => item.path !== path);
    if (listLength > this.list.length) {
      this.logger.info(`Removed module at path: ${path}`);
      return true;
    }
    this.logger.error(`Couldn't remove module, no matching module was found (${path})`);
    return false;
  }

  find(name: string): ?ModuleDefinition {
    return this.list.find(item => item.name === name);
  }

  async addInitialModules(): Promise<void> {
    try {
      // Load modules in each file in modules folder
      const contents = await promisify(fs.readdir)(this.path);
      contents.forEach((file) => {
        if (!isOSFile(file)) {
          this.add(`${this.path}/${file}`);
        }
      });
    } catch (error) {
      this.logger.error('Couldn\'t add initial modules', error);
    }
  }

  startWatching(): void {
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
          this.logger.error(`Unknown change event of type ${e} occurred`);
        }
      });

      this.watcher.on('error', (error) => {
        this.logger.error('An error occurred watching for changes in modules folder', error);
      });
    } catch (error) {
      this.logger.error('An error occurred starting watcher on modules folder', error);
    }
  }

  stopWatching(): void {
    if (this.watcher) {
      this.watcher.close();
    }
    this.watcher = null;
  }
}

export default ModuleManager;
