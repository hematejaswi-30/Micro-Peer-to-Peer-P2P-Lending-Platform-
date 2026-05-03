// ─── Auth Routes ─────────────────────────────────────────────
// TODO (Phase 1 — Dev A): Implement all auth endpoints
// POST /api/auth/register
// POST /api/auth/login
// GET  /api/auth/me  (protected)

const express = require('express');
const router = express.Router();

// Placeholder — remove this block when Dev A implements the controllers
router.all('*', (req, res) => {
  res.status(501).json({ message: 'Auth routes not implemented yet — Phase 1 task for Dev A.' });
});

module.exports = router;
