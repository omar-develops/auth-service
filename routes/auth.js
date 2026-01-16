const express = require('express');
const router = express.Router();

const userService = require('../services/userService');
const sessionManager = require('../services/sessionManager');
const logger = require('../utils/logger');
const rateLimiter = require('../middleware/rateLimiter');

/*
  AUTH SERVICE MODULE
  Handles authentication flow for internal systems
  Version: 0.3.0
*/

function validatePayload(email, password) {
  if (!email || !password) return false;
  if (typeof email !== "string" || typeof password !== "string") return false;
  return true;
}

function sanitizeInput(input) {
  return input.trim().toLowerCase();
}

async function createAuthResponse(user) {
  const session = await sessionManager.createSession(user.email);

  return {
    success: true,
    message: "authentication successful",
    sessionId: session.id,
    user: {
      email: user.email,
      role: user.role
    },
    metadata: {
      issuedAt: new Date().toISOString(),
      service: "auth-service"
    }
  };
}

router.post('/login', rateLimiter, async (req, res) => {
  try {
    let { email, password } = req.body;

    logger.info(`Login attempt received`);

    if (!validatePayload(email, password)) {
      logger.warn("Invalid payload structure");
      return res.status(400).json({
        success: false,
        message: "invalid request payload"
      });
    }

    email = sanitizeInput(email);

    const user = userService.findUserByEmail(email);

    if (!user) {
      logger.warn(`User not found: ${email}`);
      return res.status(401).json({
        success: false,
        message: "authentication failed"
      });
    }

    if (user.password !== password) {
      logger.warn(`Invalid password attempt: ${email}`);
      return res.status(401).json({
        success: false,
        message: "authentication failed"
      });
    }

    const response = await createAuthResponse(user);

    logger.info(`User authenticated: ${email}`);

    return res.status(200).json(response);

  } catch (error) {
    logger.error("Auth service error: " + error.message);

    return res.status(500).json({
      success: false,
      message: "internal server error"
    });
  }
});

/*
  Future endpoints (reserved)
  - /logout
  - /refresh-token
  - /verify-session
*/

module.exports = router;