import { ApolloServer, gql } from 'apollo-server-koa';
import { paths } from 'app/fs';
import fs from 'fs';

import { logger } from 'app/utility';

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
          .pipe(fs.createWriteStream(`${paths.modules}/${filename}`))
          .on('error', error => logger.error(`Error saving file ${error}`))
          .on('finish', () => logger.info(`${filename} saved to modules folder`));
      }

      return `Received file: ${filename}`;
    },
  },
};

// Create GraphQL server instance and attach to Koa instance
const gqlServer = new ApolloServer({ typeDefs, resolvers });

export default gqlServer;
