// @flow strict

import { gql } from 'apollo-server-koa';
import { paths } from 'app/fs';
import fs from 'fs';
import type { Logger } from 'winston';
import type { PubSub } from 'graphql-subscriptions';

import types from './types';
import queries from './queries';

// Construct a schema using GraphQL schema language
export const typeDefs = gql`
  type Query {
    hello: String
    ${queries.definitions}
  }

  type Subscription {
    modulesUpdated: [Module]
  }

  type Mutation {
    singleUpload(file: Upload!): String!
  }

  ${types}
`;

type Resolvers = {
  Query: {},
  Mutation: {},
  Subscription: {},
}

// Provide resolver functions for your schema fields with logger and pubsub attachments
export function createResolvers(pubsub: PubSub, logger: Logger): Resolvers {
  return {
    Query: {
      hello: () => 'Hello world!',
      ...queries.resolvers,
    },
    Mutation: {
      async singleUpload(parent, { file }) {
        const {
          stream,
          filename,
          mimetype,
        } = await file;

        // Save file to data folder
        if (mimetype === 'application/zip') {
          stream
            .pipe(fs.createWriteStream(`${paths.modules}/${filename}`))
            .on('error', error => logger.error(`Error saving file ${error}`))
            .on('finish', () => logger.info(`${filename} saved to modules folder`));
        }

        return `Received file: ${filename}`;
      },
    },
    Subscription: {
      modulesUpdated: {
        subscribe: () => pubsub.asyncIterator('modulesUpdated'),
      },
    },
  };
}
