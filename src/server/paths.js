import envPaths from 'env-paths';
import fs from 'fs';

const paths = envPaths('high-five');

// Create folder for logs if it doesn't exist yet
fs.access(paths.log, (err) => {
  if (err) {
    fs.mkdir(paths.log, () => {});
  }
});

// Create folder for data if it doesn't exist yet
fs.access(paths.data, (err) => {
  if (err) {
    fs.mkdir(paths.data, () => {});
  }
});

export default paths;
