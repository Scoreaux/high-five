import { promisify } from 'util';
import fs from 'fs';

import { paths } from 'app/fs';
import logger from 'app/logger';
import { isOSFile } from 'app/utility';
import loadModule from './loadModule';
import watchForChanges from './watchForChanges';

async function init() {
  try {
    // Call loadModule in each file in modules folder
    const contents = await promisify(fs.readdir)(paths.modules);
    contents.forEach((file) => {
      if (!isOSFile(file)) {
        loadModule(`${paths.modules}/${file}`);
      }
    });

    // Watch for changes in modules folder
    watchForChanges();

    return true;
  } catch (error) {
    logger.error('Couldn\'t initialize modules', error);
    return false;
  }
}

export default init;
