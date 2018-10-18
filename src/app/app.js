// @flow strict

import Koa from 'koa';
import type { ServerType } from 'koa';
import serve from 'koa-static';
import path from 'path';
import gqlServer from 'app/server';
import type { Logger } from 'winston';
import { createAllFolders } from 'app/fs';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { execute, subscribe } from 'graphql';

import { createLogger } from 'app/utility';

type RequiredPaths = {
  data: string,
  log: string,
  modules: string,
}

type Props = {
  port?: number,
  paths?: RequiredPaths,
  cwd?: string,
}

export default class App {
  koa: Koa = new Koa();

  logger: Logger;

  server: ServerType;

  subServer: SubscriptionServer;

  paths: RequiredPaths;

  port: number = 5555;

  constructor({ port, cwd, paths }: Props = {}) {
    // Set server port number
    if (port) {
      this.port = port;
    }

    // Constract paths object
    if (paths) {
      // Paths provided in props, set as paths for app instance
      this.paths = paths;
    } else {
      // Create paths for app instance based on working directory
      const cwdPath: string = cwd || process.cwd();
      this.paths = {
        data: `${cwdPath}/data`,
        log: `${cwdPath}/logs`,
        modules: `${cwdPath}/modules`,
      };
    }

    // Serve static client files
    this.koa.use(serve(path.resolve(__dirname, '../client'), {
      index: 'client.html',
    }));

    // Connect GraphQL server to koa instance
    gqlServer.applyMiddleware({ app: this.koa });
  }

  async start() {
    // Create data files and folders required for app to run
    await createAllFolders(this.paths);

    // Create logger instance
    this.logger = await createLogger();

    // Start HTTP server
    this.server = this.koa.listen({ port: this.port }, () => {
      this.logger.info(`Koa server started on port ${this.port}`);
    });

    // Create subscription server and attach to GraphQL server
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
