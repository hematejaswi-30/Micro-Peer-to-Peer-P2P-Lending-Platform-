// ─── Auth Routes ─────────────────────────────────────────────
// TODO (Phase 1 — Dev A): Implement all auth endpoints
// POST /api/auth/register
// POST /api/auth/login
// GET  /api/auth/me  (protected)

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/me', authMiddleware.protect, userController.getMe);

module.exports = router;
