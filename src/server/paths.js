import envPaths from 'env-paths';
import fs from 'fs';
import { promisify } from 'util';

const systemPaths = envPaths('high-five');
const paths = {
  ...systemPaths,
  modules: `${systemPaths.data}/modules`,
};

export async function createFolder(path) {
  try {
    // Create folder for logs if it doesn't exist yet
    try {
      await promisify(fs.access)(path);
    } catch (error) {
      await promisify(fs.mkdir)(path);
    }
    return true;
  } catch (error) {
    console.log(`Couldn't create folder ${path}`, error);
    return false;
  }
}

export async function createAllFolders() {
  const createdLog = await createFolder(paths.log);
  const createdData = await createFolder(paths.data);
  const createdModules = await createFolder(paths.modules);

  return (createdLog && createdData && createdModules);
}

export default paths;
