import winston, { format } from 'winston';
import { SPLAT } from 'triple-beam';

import { paths, createFolder } from 'app/fs';

const {
  printf,
  timestamp,
  colorize,
  combine,
  splat,
} = format;

// Create custom format for logs
const myFormat = printf(info => `${info.timestamp} ${info.level}: ${info.message}${info[SPLAT] ? `\n${info[SPLAT]}` : ''}`);

const logger = winston.createLogger({
  format: combine(
    splat(),
    timestamp(),
    colorize(),
    myFormat,
  ),
});

if (process.env.NODE_ENV === 'development') {
  // Add console output for logs
  logger.add(new winston.transports.Console({}));
}

async function init() {
  // Don't add file logging when testing
  if (process.env.NODE_ENV !== 'test') {
    await createFolder(paths.log);

    logger.add(new winston.transports.File({
      filename: `${paths.log}/combined.log`,
      level: 'info',
    }));
    logger.add(new winston.transports.File({
      filename: `${paths.log}/error.log`,
      level: 'error',
    }));
  }
}

init();

export default logger;
