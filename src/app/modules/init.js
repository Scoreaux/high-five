import { promisify } from 'util';
import fs from 'fs';

import { paths } from 'app/fs';
import { logger, isOSFile } from 'app/utility';
import ModuleManager from './ModuleManager';

async function init() {
  try {
    const modules = new ModuleManager();
    // Load modules in each file in modules folder
    const contents = await promisify(fs.readdir)(paths.modules);
    contents.forEach((file) => {
      if (!isOSFile(file)) {
        modules.add(`${paths.modules}/${file}`);
      }
    });

    return modules;
  } catch (error) {
    logger.error('Couldn\'t initialize modules', error);
    return null;
  }
}

export default init;
