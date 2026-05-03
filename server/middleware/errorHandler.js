// ─── Global Error Handler ────────────────────────────────────
// Attach as the LAST middleware in index.js: app.use(errorHandler)

const errorHandler = (err, req, res, next) => {
  const status = err.status || err.statusCode || 500;

  // Log full error in dev; suppress stack in production
  if (process.env.NODE_ENV !== 'production') {
    console.error(`[${status}] ${err.message}`);
    console.error(err.stack);
  }

  // Mongoose validation error → 400
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ error: 'Validation failed', details: messages });
  }

  // Mongoose duplicate key → 409
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(409).json({ error: `${field} already exists.` });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'Invalid token.' });
  }
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ error: 'Token expired.' });
  }

  res.status(status).json({
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message
  });
};

module.exports = errorHandler;
