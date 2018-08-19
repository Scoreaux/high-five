import Koa from 'koa';
import serve from 'koa-static';
import path from 'path';
import gqlServer from 'app/server';
import { createAllFolders } from 'app/fs';
import modules from 'app/modules';

import { logger } from 'app/utility';

// Create Koa instance
const app = new Koa();

async function init() {
  // Create data files and folders required for app to run
  await createAllFolders();

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
