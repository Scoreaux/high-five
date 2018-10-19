#! /usr/bin/env node

const App = require('../dist/app').default;

const instance = new App({ cwd: `${process.cwd()}/testFolder` });

const init = async () => {
  await instance.start();

  setTimeout(() => {
    instance.logger.info('Pubsubbing!');
    instance.pubsub.publish('modulesUpdated', {
      modulesUpdated: [{
        name: 'TEST MODULE PUBSUB FOR FIRST ONLY!',
      }],
    });
  }, 10000);
};

init();
