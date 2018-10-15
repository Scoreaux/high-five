// @flow strict

import envPaths from 'env-paths';

type SystemPaths = {
  data: string,
  config: string,
  cache: string,
  log: string,
  tempt: string,
}

type AppPaths = { modules: string }

const systemPaths: SystemPaths = envPaths('high-five');
const paths: SystemPaths & AppPaths = {
  ...systemPaths,
  modules: `${systemPaths.data}/modules`,
};

export default paths;
