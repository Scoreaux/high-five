import Koa from 'koa';
import serve from 'koa-static';
import { ApolloServer, gql } from 'apollo-server-koa';
import path from 'path';

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

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type Query {
    hello: String
  }
`;

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    hello: () => 'Hello world!',
  },
};

// Create GraphQL server instance and attach to Koa instance
const gqlServer = new ApolloServer({ typeDefs, resolvers });
gqlServer.applyMiddleware({ app });

// const requireFunc = typeof __webpack_require__ === "function" ? __non_webpack_require__ : require;
// const foo = requireFunc(moduleName);
