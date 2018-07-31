import winston, { format } from 'winston';

const { printf, timestamp, colorize, combine } = format;

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
      filename: 'combined.log',
      level: 'info',
    }),
    new winston.transports.File({
      filename: 'error.log',
      level: 'error',
    }),
  ],
});

if (process.env.NODE_ENV === 'development') {
  logger.add(new winston.transports.Console({
  }));
}

export default logger;
