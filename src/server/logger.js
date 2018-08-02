import winston, { format } from 'winston';

import paths from 'server/paths';

const {
  printf,
  timestamp,
  colorize,
  combine,
} = format;

// Create custom format for logs
const myFormat = printf(info => `${info.timestamp} ${info.level}: ${info.message}`);

// Create logger instance
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

if (process.env.NODE_ENV === 'development') {
  // Add console output for logs
  logger.add(new winston.transports.Console({}));
}

export default logger;
