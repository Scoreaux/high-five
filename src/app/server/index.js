import { ApolloServer, gql } from 'apollo-server-koa';
import { paths } from 'app/fs';
import fs from 'fs';
import { PubSub } from 'graphql-subscriptions';
import { makeExecutableSchema } from 'graphql-tools';

import { logger } from 'app/utility';
import types from './types';
import queries from './queries';

export const pubsub = new PubSub();

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
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

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    hello: () => 'Hello world!',
    ...queries.resolvers,
  },
  Mutation: {
    async singleUpload(parent, { file }) {
      const { stream, filename, mimetype, encoding } = await file;

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

setTimeout(() => {
  logger.info('Pubsubbing!');
  pubsub.publish('modulesUpdated', {
    modulesUpdated: [{
      name: 'TEST MODULE PUBSUB!',
    }],
  });
}, 15000);

// export const schema = makeExecutableSchema({ typeDefs, resolvers });

// Create GraphQL server instance and attach to Koa instance
const gqlServer = new ApolloServer({
  typeDefs,
  resolvers,
  subscriptions: {
    path: '/subscriptions',
  }
});

export default gqlServer;
