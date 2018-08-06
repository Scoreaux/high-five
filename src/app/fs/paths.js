import envPaths from 'env-paths';

const systemPaths = envPaths('high-five');
const paths = {
  ...systemPaths,
  modules: `${systemPaths.data}/modules`,
};

export default paths;
