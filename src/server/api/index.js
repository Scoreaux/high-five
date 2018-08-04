import { ApolloServer, gql } from 'apollo-server-koa';
import path from 'path';
import paths from 'server/paths';
import fs from 'fs';

import logger from 'server/logger';

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type Query {
    hello: String
  }

  type Mutation {
    singleUpload(file: Upload!): String!
  }
`;

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    hello: () => 'Hello world!',
  },
  Mutation: {
    async singleUpload(parent, { file }) {
      const { stream, filename, mimetype, encoding } = await file;

      // Save file to data folder
      if (mimetype === 'application/zip') {
        stream
          .on('error', (error) => {
            if (stream.truncated) {
              fs.unlinkSync(path);
              logger.error('Error saving file, truncated?', error);
            }
          })
          .pipe(fs.createWriteStream(`${paths.data}/modules/${filename}`))
          .on('error', error => logger.error(`Error saving file ${error}`))
          .on('finish', () => logger.info(`${filename} saved to data folder`));
      }

      return `Received file: ${filename}`;
    },
  },
};

// Create GraphQL server instance and attach to Koa instance
const gqlServer = new ApolloServer({ typeDefs, resolvers });

export default gqlServer;
