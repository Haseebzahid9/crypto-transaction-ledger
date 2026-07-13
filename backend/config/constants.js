const path = require('path');

module.exports = {
  PORT: process.env.PORT || 3000,
  DATA_FILE: path.join(__dirname, '..', 'data', 'transactions.json'),
  DEFAULT_PAGE_SIZE: 10
};
