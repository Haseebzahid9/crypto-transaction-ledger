module.exports = (transactions, address) => {
  const normalized = address.trim().toLowerCase();
  const received = transactions
    .filter((tx) => tx.receiver.toLowerCase() === normalized)
    .reduce((sum, tx) => sum + tx.amount, 0);
  const sent = transactions
    .filter((tx) => tx.sender.toLowerCase() === normalized)
    .reduce((sum, tx) => sum + tx.amount, 0);

  return {
    wallet: address.trim(),
    received,
    sent,
    balance: received - sent
  };
};
