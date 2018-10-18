// @flow strict

import winston, { format } from 'winston';
import type { Logger } from 'winston';
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

export default async function createLogger(): Logger {
  const logger = winston.createLogger({
    format: combine(
      splat(),
      timestamp(),
      colorize(),
      myFormat,
    ),
  });

  if (process.env.NODE_ENV !== 'production') {
    // Add console output
    logger.add(new winston.transports.Console({
      silent: process.env.NODE_ENV === 'test',
    }));
  }

  if (process.env.NODE_ENV !== 'test') {
    // Create logs folder
    await createFolder(paths.log);

    // Add file outputs
    logger.add(new winston.transports.File({
      filename: `${paths.log}/combined.log`,
      level: 'info',
    }));
    logger.add(new winston.transports.File({
      filename: `${paths.log}/error.log`,
      level: 'error',
    }));
  }

  return logger;
}
