const crypto = require('crypto');

module.exports = (transaction) => {
  const hashInput = `${transaction.id}|${transaction.sender}|${transaction.receiver}|${transaction.amount}|${transaction.timestamp}`;
  return crypto.createHash('sha256').update(hashInput).digest('hex');
};
