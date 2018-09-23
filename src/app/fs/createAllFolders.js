// @flow

import paths from './paths';
import createFolder from './createFolder';

async function createAllFolders(): Promise<boolean> {
  const createdLog = await createFolder(paths.log);
  const createdData = await createFolder(paths.data);
  const createdModules = await createFolder(paths.modules);

  return (createdLog && createdData && createdModules);
}

export default createAllFolders;
