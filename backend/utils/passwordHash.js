const crypto = require('crypto');

const hashPassword = (password) => {
  return crypto.createHash('sha256').update(password).digest('hex');
};

const comparePassword = (inputPassword, hashedPassword) => {
  const hashedInput = crypto
    .createHash('sha256')
    .update(inputPassword)
    .digest('hex');
  return hashedInput === hashedPassword;
};
