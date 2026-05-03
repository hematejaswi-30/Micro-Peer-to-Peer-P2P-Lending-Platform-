// ─── Auth Middleware ────────────────────────────────────────
// TODO (Phase 1 — Dev A): Implement JWT verification
// This file is scaffolded by Lead so Dev A knows the expected signature.

const jwt = require('jsonwebtoken');

/**
 * Verifies the JWT from the Authorization header.
 * On success, attaches decoded user payload to req.user.
 * Usage: router.get('/protected', verifyToken, controller)
 */
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token.' });
  }
};

/**
 * Role guard — use AFTER verifyToken.
 * Usage: router.post('/loans', verifyToken, requireRole('borrower'), controller)
 */
const requireRole = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ error: 'Access forbidden. Insufficient permissions.' });
  }
  next();
};

module.exports = { verifyToken, requireRole };
