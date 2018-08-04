import Koa from 'koa';
import serve from 'koa-static';
import path from 'path';
import gqlServer from 'server/api';

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
