// @flow

import { promisify } from 'util';
import fs from 'fs';

import { safeRequire } from 'app/utility';
import type { ModuleDefinition } from './types';

const moduleTypes: Array<string> = ['source', 'modifier', 'view'];

async function getModuleInfo(path: string = ''): Promise<ModuleDefinition> {
  // Get path stats
  const stats = await promisify(fs.stat)(path);

  if (!stats.isDirectory()) {
    // Path is not a directory, throw error
    throw new Error('path is not a directory');
  }

  // delete existing package.json cache
  delete safeRequire.cache[`${path}/package.json`];
  // Load package.json
  const packageJson = safeRequire(`${path}/package.json`);

  // Check validity of package.json
  if (!packageJson.highFive) {
    throw new Error('highFive key is missing from package.json');
  } else if (
    !packageJson.highFive.type
    || !moduleTypes.includes(packageJson.highFive.type)
  ) {
    throw new Error('Module type is missing or invalid');
  }

  // Valid module
  return {
    ...packageJson,
    path,
  };
}

export default getModuleInfo;
