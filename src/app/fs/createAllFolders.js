// @flow strict

import createFolder from './createFolder';

async function createAllFolders(paths: { [string]: string } = {}): Promise<boolean> {
  const actions = Object.keys(paths).map(key => createFolder(paths[key]));

  const results = await Promise.all(actions);

  if (results.length > 0 && !results.includes(false)) {
    return true;
  }
  return false;
}

export default createAllFolders;
