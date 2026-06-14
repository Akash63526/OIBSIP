const config = require('../config/env');
const logger = require('../utils/logger');
const ApiError = require('../utils/ApiError');
const { errorResponse } = require('../utils/responseFormatter');

const errorHandler = (err, req, res, next) => {
  let error = err;

  // If the error is not an instance of ApiError, convert it
  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Internal Server Error';
    error = new ApiError(statusCode, message, false, err.stack);
  }

  const { statusCode, message } = error;

  res.locals.errorMessage = error.message;

  const response = {
    code: statusCode,
    message,
    ...(config.env === 'development' && { stack: err.stack }),
  };

  if (config.env === 'development') {
    logger.error(`Error: ${message}`, { stack: error.stack });
  }

  return errorResponse(res, statusCode, message, response.stack ? { stack: response.stack } : null);
};

module.exports = errorHandler;
