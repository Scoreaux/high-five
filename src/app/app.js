// @flow strict

import Koa from 'koa';
import type { Server } from 'koa';
import serve from 'koa-static';
import path from 'path';
import gqlServer from 'app/server';
import { createAllFolders } from 'app/fs';
// import modules from 'app/modules';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { execute, subscribe } from 'graphql';

import { logger } from 'app/utility';

type Props = {
  port?: number,
  directory?: string,
}

export default class App {
  app: Koa = new Koa()

  server: Server;

  subServer: SubscriptionServer;

  directory: string;

  constructor({ port, directory }: Props = {}) {
    // Create data files and folders required for app to run
    this.path = directory || process.cwd();
    createAllFolders(this.directory);

    // Serve static client files
    this.app.use(serve(path.resolve(__dirname, '../client'), {
      index: 'client.html',
    }));

    // Add GraphQL API as middleware to server
    gqlServer.applyMiddleware({ app: this.app });

    // Start server
    this.server = this.app.listen({ port: port || 5555 }, () => {
      logger.info(`Koa server started on port ${port || 5555}`);
    });

    this.subServer = new SubscriptionServer({
      execute,
      subscribe,
      schema: gqlServer.schema,
    }, {
      path: '/subscriptions',
      server: this.server,
    });
  }
}
