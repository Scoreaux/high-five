import envPaths from 'env-paths';
import fs from 'fs';
import { promisify } from 'util';

const access = promisify(fs.access);
const paths = envPaths('high-five');

export async function createLogFolder() {
  try {
    // Create folder for logs if it doesn't exist yet
    try {
      await access(paths.log);
    } catch (error) {
      console.log(error);
      console.log('Creating log folder');
      fs.mkdir(paths.log, () => {});
    }
    return true;
  } catch (error) {
    console.log('Couldn\'t create required data folders');
    return false;
  }
}

export async function createDataFolder() {
  try {
    // Create folder for data if it doesn't exist yet
    try {
      await access(paths.data);
    } catch (error) {
      console.log('Creating data folder');
      fs.mkdir(paths.data, () => {});
    }

    // Create folder for modules if it doesn't exist yet
    try {
      await access(`${paths.data}/modules`);
    } catch (error) {
      console.log('Creating data/modules folder');
      fs.mkdir(`${paths.data}/modules`, () => {});
    }

    return true;
  } catch (error) {
    console.log('Couldn\'t create required data folders');
    return false;
  }
}

export async function createFolders() {
  const createdLog = await createLogFolder();
  const createdData = await createDataFolder();

  return (createdLog && createdData);
}

export default paths;
