// @flow strict

import fs from 'fs';
import { promisify } from 'util';

async function createFolder(path: string): Promise<boolean> {
  try {
    // Create folder for logs if it doesn't exist yet
    try {
      await promisify(fs.access)(path);
    } catch (error) {
      await promisify(fs.mkdir)(path);
    }
    return true;
  } catch (error) {
    // Couldn't create folder
    return false;
  }
}

export default createFolder;
