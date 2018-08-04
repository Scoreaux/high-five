import Koa from 'koa';
import serve from 'koa-static';
import path from 'path';
import gqlServer from 'server/api';
import watch from 'node-watch';
import paths from 'server/paths';
import fs from 'fs';
import { promisify } from 'util';

import logger from 'server/logger';

// Create Koa instance
const app = new Koa();

// Serve static client files
app.use(serve(path.resolve(__dirname, '../client'), {
  index: 'client.html',
}));

// Start server
app.listen({ port: 5555 }, () => {
  logger.info('Koa server started on port 5555');
});

// Add GraphQL API as middleware to server
gqlServer.applyMiddleware({ app });

// const requireFunc = typeof __webpack_require__ === "function" ? __non_webpack_require__ : require;
// const foo = requireFunc(moduleName);

async function loadModule(file = '') {
  try {
    // Get file stats
    const stats = await promisify(fs.stat)(file);
    if (stats.isDirectory()) {
      // File is a directory
      logger.info(`${file} is a directory! moving onto next check...`);

      const packageJson = __non_webpack_require__(`${file}/package.json`);
      console.log(packageJson);

    } else {
      // File is not a loadable module
      throw new Error(`${file} is not a directory`);
    }
  } catch (error) {
    logger.error(`Couldn't load module ${file}`, error);
  }
}

// Create data folder watcher
const dataWatcher = watch(paths.data, { recursive: false });

dataWatcher.on('change', (e, file) => {
  if (e === 'update') {
    // File has been updated/created, load/reload module
    //logger.info(`Item ${file} updated`);
    loadModule(file);
  } else if (e === 'remove') {
    // File has been deleted, unload module
    //logger.info(`Item ${file} removed`);
  }
});
