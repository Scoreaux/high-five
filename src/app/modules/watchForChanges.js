import watch from 'node-watch';
import { isOSFile } from 'app/utility';
import { paths } from 'app/fs';
import { loadModule, unloadModule } from './modules';

function watchForChanges() {
  // Create data folder watcher
  const dataWatcher = watch(paths.modules, { recursive: false });

  dataWatcher.on('change', (e, file) => {
    if (e === 'update') {
      // File has been updated/created, load/reload module
      // logger.info(`Item ${file} updated`);
      if (!isOSFile(file)) {
        loadModule(file);
      }
    } else if (e === 'remove') {
      // File has been deleted, unload module
      // logger.info(`Item ${file} removed`);
      if (!isOSFile(file)) {
        unloadModule(file);
      }
    }
  });

  return dataWatcher;
}

export default watchForChanges;
