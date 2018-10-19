// @flow strict

import Koa from 'koa';
import type { ServerType } from 'koa';
import serve from 'koa-static';
import { ApolloServer } from 'apollo-server-koa';
import type { Logger } from 'winston';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { PubSub } from 'graphql-subscriptions';
import { execute, subscribe } from 'graphql';
import path from 'path';
import { createAllFolders } from 'app/fs';
import { createLogger } from 'app/utility';
import { typeDefs, createResolvers } from 'app/server';

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
  koa: Koa;

  logger: Logger;

  pubsub: PubSub;

  httpServer: ServerType;

  gqlServer: ApolloServer;

  subServer: SubscriptionServer;

  paths: RequiredPaths;

  port: number = 5555;

  constructor({ port, cwd, paths }: Props = {}) {
    // Set server port number
    if (port) {
      this.port = port;
    }

    // Construct paths object
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
  }

  async start() {
    // Create data files and folders required for app to run
    await createAllFolders(this.paths);

    // Create logger instance
    this.logger = await createLogger();

    // Create Koa instance and serve static client files
    this.koa = new Koa();
    this.koa.use(serve(path.resolve(__dirname, '../client'), {
      index: 'client.html',
    }));

    // Create PubSub instance to handle GraphQL subscriptions
    this.pubsub = new PubSub();

    // Create GraphQL server instance
    this.gqlServer = new ApolloServer({
      typeDefs,
      resolvers: createResolvers(this.pubsub, this.logger),
      subscriptions: {
        path: '/subscriptions',
      }
    });

    // Start HTTP server from Koa instance
    this.httpServer = this.koa.listen({ port: this.port }, () => {
      this.logger.info(`Koa server started on port ${this.port}`);
    });

    // Attach GraphQL server instance to Koa instance
    this.gqlServer.applyMiddleware({ app: this.koa });

    // Create subscription server instance and attach to GraphQL server instance
    this.subServer = new SubscriptionServer({
      execute,
      subscribe,
      schema: this.gqlServer.schema,
    }, {
      path: '/subscriptions',
      server: this.httpServer,
    });
  }
}
