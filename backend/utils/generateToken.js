const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'supersecretkey12345_antigravity_project_portal', {
    expiresIn: '30d',
  });
};

module.exports = generateToken;
