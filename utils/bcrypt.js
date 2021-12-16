const bcrypt = require('bcryptjs');

async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  return hash;
}

async function comparePassword(password, hash) {
  const check = await bcrypt.compare(password, hash);
  return check;
}

module.exports = { hashPassword, comparePassword };
