const { createLogger, format, transports } = require('winston');
require('winston-daily-rotate-file');
const path = require('path');

const logDir = path.resolve(__dirname, '..', 'logs');
const fs = require('fs');
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });

const dailyRotateTransport = new transports.DailyRotateFile({
  filename: 'neuralift-%DATE%.log',
  dirname: logDir,
  datePattern: 'YYYY-MM-DD',
  maxFiles: '14d',
  zippedArchive: true,
  level: 'info',
});

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
  transports: [
    dailyRotateTransport,
    new transports.Console({ format: format.combine(format.colorize(), format.simple()) }),
  ],
  exitOnError: false,
});

module.exports = logger;
