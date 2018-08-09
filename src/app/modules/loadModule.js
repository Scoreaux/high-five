import { promisify } from 'util';
import fs from 'fs';

import { logger } from 'app/utility';
import { safeRequire } from 'app/utility';

async function loadModule(file = '') {
  const moduleTypes = ['source', 'modifier', 'view'];

  try {
    // Get file stats
    const stats = await promisify(fs.stat)(file);

    if (!stats.isDirectory()) {
      // File is not a directory, throw error
      throw new Error('path is not a directory');
    }

    // delete existing package.json cache
    delete safeRequire.cache[`${file}/package.json`];
    // Load package.json
    const packageJson = safeRequire(`${file}/package.json`);

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

export default loadModule;
