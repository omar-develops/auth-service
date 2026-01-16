const logger = require('../utils/logger');

/*
  Internal DB connector (simulated)
  Uses environment configuration for secure connection
*/

const DB_CONFIG = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
};

function connect() {
  if (!DB_CONFIG.host || !DB_CONFIG.user) {
    logger.error("Database connection failed: missing config");
    return false;
  }

  logger.info(`Connected to database at ${DB_CONFIG.host}`);
  return true;
}

module.exports = {
  connect,
  config: DB_CONFIG
};