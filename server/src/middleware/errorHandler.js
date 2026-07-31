const errorHandler = (err, req, res, next) => {
  console.error('[Error Handler]', err);

  let statusCode = res.statusCode === 200 ? 400 : res.statusCode;
  let message = err.message || 'Request processing failed. Please check your payload.';

  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors).map((val) => val.message).join(', ');
  }

  if (err.code === 11000) {
    statusCode = 400;
    message = 'Duplicate field value entered';
  }

  res.status(statusCode).json({
    success: false,
    code: statusCode,
    status: 'error',
    message,
  });
};

module.exports = errorHandler;
