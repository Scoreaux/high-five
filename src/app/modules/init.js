// @flow strict

import { promisify } from 'util';
import fs from 'fs';

import { logger, isOSFile } from 'app/utility';
import ModuleManager from './ModuleManager';

// const modules: ModuleManager = new ModuleManager();

// export async function init(): Promise<void> {
//   try {
//     // Load modules in each file in modules folder
//     const contents = await promisify(fs.readdir)(paths.modules);
//     contents.forEach((file) => {
//       if (!isOSFile(file)) {
//         modules.add(`${paths.modules}/${file}`);
//       }
//     });
//   } catch (error) {
//     logger.error('Couldn\'t initialize modules', error);
//   }
// }

// init();

// export default modules;
