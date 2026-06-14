const crypto = require('crypto');

const generateToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

const hashToken = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

const calculateOrderTotal = (basePrice, ingredients) => {
  const ingredientsTotal = ingredients.reduce((total, item) => total + item.price, 0);
  return basePrice + ingredientsTotal;
};

module.exports = {
  generateToken,
  hashToken,
  calculateOrderTotal
};
