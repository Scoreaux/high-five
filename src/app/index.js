import Koa from 'koa';
import serve from 'koa-static';
import path from 'path';
import gqlServer from 'app/server';
import { createAllFolders } from 'app/fs';

import logger from 'app/logger';
import * as modules from 'app/modules';

// Create Koa instance
const app = new Koa();

async function init() {
  // Create data files and folders required for app to run
  await createAllFolders();

  // Load modules from data folder into app state
  modules.init();

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
