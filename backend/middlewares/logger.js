const winston = require('winston');
const expressWinston = require('express-winston');
const path = require('path');

const logsDir = path.join(__dirname, '../..', 'backend');

const requestLogger = expressWinston.logger({
  transports: [
    new winston.transports.File({ filename: path.join(logsDir, 'request.log') }),
  ],
  format: winston.format.json(),
});

const errorLogger = expressWinston.errorLogger({
  transports: [
    new winston.transports.File({ filename: path.join(logsDir, 'error.log') }),
  ],
  format: winston.format.json(),
});

module.exports = {
  requestLogger,
  errorLogger,
};
