import * as modules from './modules';

const resolvers = {
  modules: modules.resolver,
};

const definitions = `
  ${modules.definition}
`;

export default {
  resolvers,
  definitions,
};
