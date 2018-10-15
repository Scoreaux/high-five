// @flow strict

import createFolder from './createFolder';

async function createAllFolders(path: string): Promise<boolean> {
  const createdLog = await createFolder(`${path}/logs`);
  const createdData = await createFolder(`${path}/data`);
  const createdModules = await createFolder(`${path}/modules`);

  return (createdLog && createdData && createdModules);
}

export default createAllFolders;
