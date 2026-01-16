const db = require('../database/dbClient');
const logger = require('../utils/logger');

/*
  User service simulates DB-backed authentication lookup
*/

const fakeUsers = [
  {
    id: 1,
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD,
    role: "admin"
  }
];

function findUserByEmail(email) {
  db.connect();

  logger.info(`Querying user: ${email}`);

  return fakeUsers.find(user => user.email === email);
}

module.exports = {
  findUserByEmail
};