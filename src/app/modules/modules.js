import fs from 'fs';
import { promisify } from 'util';
import watch from 'node-watch';

import { paths } from 'app/fs';
import logger from 'app/logger';
import { isOSFile } from 'app/utility';

export async function loadModule(file = '') {
  const moduleTypes = ['source', 'modifier', 'view'];

  try {
    // Get file stats
    const stats = await promisify(fs.stat)(file);

    if (!stats.isDirectory()) {
      // File is not a directory, throw error
      throw new Error('path is not a directory');
    }

    // delete existing package.json cache
    delete __non_webpack_require__.cache[`${file}/package.json`];
    // Load package.json
    const packageJson = __non_webpack_require__(`${file}/package.json`);

    // Check validity of package.json
    if (!packageJson.highFive) {
      throw new Error('highFive key is missing from package.json');
    } else if (
      !packageJson.highFive.type
      || !moduleTypes.includes(packageJson.highFive.type)
    ) {
      throw new Error('Module type is missing or invalid');
    }

    logger.info(`Module detected: ${packageJson.name} of type ${packageJson.highFive.type}`);
  } catch (error) {
    logger.error(`Couldn't load module ${file}`, error);
  }
}

export async function unloadModule(name) {
  logger.info(`Unloaded module ${name}`);
}

export async function watchForModuleChanges() {
  // Create data folder watcher
  const dataWatcher = watch(paths.modules, { recursive: false });

  dataWatcher.on('change', (e, file) => {
    if (e === 'update') {
      // File has been updated/created, load/reload module
      // logger.info(`Item ${file} updated`);
      if (!isOSFile(file)) {
        loadModule(file);
      }
    } else if (e === 'remove') {
      // File has been deleted, unload module
      // logger.info(`Item ${file} removed`);
      if (!isOSFile(file)) {
        unloadModule(file);
      }
    }
  });

  return dataWatcher;
}

export async function init() {
  try {
    const contents = await promisify(fs.readdir)(paths.modules);
    contents.forEach((file) => {
      if (!isOSFile(file)) {
        loadModule(`${paths.modules}/${file}`);
      }
    });

    watchForModuleChanges();
  } catch (error) {
    logger.error('Couldn\'t initialize modules', error);
  }
}
