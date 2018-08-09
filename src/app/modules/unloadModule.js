import logger from 'app/logger';

async function unloadModule(name = '') {
  logger.info(`Unloaded module ${name}`);
  return true;
}

export default unloadModule;
