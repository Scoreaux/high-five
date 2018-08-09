import { logger } from 'app/utility';

async function unloadModule(name = '') {
  logger.info(`Unloaded module ${name}`);
  return true;
}

export default unloadModule;
