export function notFoundHandler(req, res) {
  res.status(404).json({ error: { message: `Route ${req.method} ${req.originalUrl} does not exist.` } });
}

// One place that turns an error into JSON, so no route leaks a stack trace.
export function errorHandler(err, _req, res, _next) {
  const status = err.status || 500;
  if (status >= 500) console.error(err);

  res.status(status).json({
    error: {
      message: status >= 500 ? 'Something went wrong on the server.' : err.message,
      ...(err.details ? { details: err.details } : {}),
    },
  });
}
