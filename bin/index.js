#! /usr/bin/env node

const App = require('../dist/app').default;

const instance = new App({ cwd: `${process.cwd()}/testFolder` });

instance.start();
