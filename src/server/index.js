import Koa from 'koa';
import serve from 'koa-static';
import path from 'path';
import gqlServer from 'server/api';
import watch from 'node-watch';
import paths, { createFolders } from 'server/paths';
import fs from 'fs';
import { promisify } from 'util';

import logger from 'server/logger';

// Create Koa instance
const app = new Koa();

async function loadModule(file = '') {
  try {
    // Get file stats
    const stats = await promisify(fs.stat)(file);

    if (!stats.isDirectory()) {
      // File is not a directory, throw error
      throw new Error(`${file} is not a directory`);
    }

    const packageJson = __non_webpack_require__(`${file}/package.json`);
    console.log(packageJson);
  } catch (error) {
    logger.error(`Couldn't load module ${file}`, error);
  }
}

async function init() {
  // Create data files and folders required for app to run
  await createFolders();

  // Create data folder watcher
  const dataWatcher = watch(`${paths.data}/modules`, { recursive: false });

  dataWatcher.on('change', (e, file) => {
    if (e === 'update') {
      // File has been updated/created, load/reload module
      // logger.info(`Item ${file} updated`);
      loadModule(file);
    } else if (e === 'remove') {
      // File has been deleted, unload module
      // logger.info(`Item ${file} removed`);
    }
  });

  // Serve static client files
  app.use(serve(path.resolve(__dirname, '../client'), {
    index: 'client.html',
  }));

  // Add GraphQL API as middleware to server
  gqlServer.applyMiddleware({ app });

  // Start server
  app.listen({ port: 5555 }, () => {
    logger.info('Koa server started on port 5555');
  });
}

init();

// const requireFunc = typeof __webpack_require__ === "function" ? __non_webpack_require__ : require;
// const foo = requireFunc(moduleName);
