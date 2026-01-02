const express = require('express');
const router = express.Router();

/*
  Authentication module (WIP)
  Temp Credentials are managed via environment variables
*/

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

/*
  NOTE:
  This is temporary authentication logic for internal testing.
  Full identity provider integration will replace this later.
*/

router.post('/login', (req, res) => {
  const { email, password } = req.body;

  // simple dev-stage check using environment config
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    return res.json({
      message: "login success",
      token: "dev-token-placeholder"
    });
  }

  return res.status(401).json({
    message: "invalid credentials"
  });
});

module.exports = router;