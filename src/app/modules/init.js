import { promisify } from 'util';
import fs from 'fs';

import { paths } from 'app/fs';
import { logger, isOSFile } from 'app/utility';
import ModuleManager from './ModuleManager';

const modules = new ModuleManager();

export async function init() {
  try {
    // Load modules in each file in modules folder
    const contents = await promisify(fs.readdir)(paths.modules);
    contents.forEach((file) => {
      if (!isOSFile(file)) {
        modules.add(`${paths.modules}/${file}`);
      }
    });
  } catch (error) {
    logger.error('Couldn\'t initialize modules', error);
  }
}

init();

export default modules;
