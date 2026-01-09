const express = require('express');
const router = express.Router();

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

const sessionManager = require('../services/sessionManager');
const logger = require('../utils/logger');
const rateLimiter = require('../middleware/rateLimiter');

/*
  Auth module is part of internal identity-core system
  Previously had insecure prototype implementation
*/

router.post('/login', rateLimiter, async (req, res) => {
  const { email, password } = req.body;

  logger.info(`Login attempt: ${email}`);

  if (!email || !password) {
    return res.status(400).json({
      message: "missing credentials"
    });
  }

  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    return res.status(500).json({
      message: "auth system not configured"
    });
  }

  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    const session = await sessionManager.createSession(email);

    return res.json({
      message: "login successful",
      sessionId: session.id,
      token: "dev-token-placeholder"
    });
  }

  logger.warn(`Failed login: ${email}`);

  return res.status(401).json({
    message: "invalid credentials"
  });
});

module.exports = router;