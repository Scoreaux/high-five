import winston, { format } from 'winston';
import fs from 'fs';

import paths from 'server/paths';

const { printf, timestamp, colorize, combine } = format;

// Create folder for logs if it doesn't exist yet
fs.access(paths.log, (err) => {
  if (err) {
    fs.mkdir(paths.log, () => {});
  }
});

// Define your custom format with printf.
const myFormat = printf(info => `${info.timestamp} ${info.level}: ${info.message}`);

const logger = winston.createLogger({
  format: combine(
    timestamp(),
    colorize(),
    myFormat,
  ),
  transports: [
    new winston.transports.File({
      filename: `${paths.log}/combined.log`,
      level: 'info',
    }),
    new winston.transports.File({
      filename: `${paths.log}/error.log`,
      level: 'error',
    }),
  ],
});

console.log(`${paths.log}/combined.log`);

if (process.env.NODE_ENV === 'development') {
  logger.add(new winston.transports.Console({}));
}

export default logger;
