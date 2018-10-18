// @flow strict

import envPaths from 'env-paths';

type SystemPaths = {
  data: string,
  config: string,
  cache: string,
  log: string,
  temp: string,
}

type AppPaths = { modules: string }

export type Paths = SystemPaths & AppPaths

const systemPaths: SystemPaths = envPaths('high-five');
const paths: Paths = {
  ...systemPaths,
  modules: `${systemPaths.data}/modules`,
};

export default paths;
