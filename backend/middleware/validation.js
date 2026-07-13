exports.validateTransactionBody = (req, res, next) => {
  const { sender, receiver, amount } = req.body;
  const errors = [];

  if (!sender || typeof sender !== 'string' || !sender.trim()) {
    errors.push('Sender is required and must be a non-empty string.');
  }

  if (!receiver || typeof receiver !== 'string' || !receiver.trim()) {
    errors.push('Receiver is required and must be a non-empty string.');
  }

  if (sender && receiver && sender.trim().toLowerCase() === receiver.trim().toLowerCase()) {
    errors.push('Sender and receiver cannot be the same.');
  }

  if (amount === undefined || amount === null || isNaN(amount) || Number(amount) <= 0) {
    errors.push('Amount is required and must be a number greater than zero.');
  }

  if (errors.length) {
    return res.status(400).json({ success: false, message: errors.join(' ') });
  }

  next();
};

exports.validateWalletAddress = (req, res, next) => {
  const { address } = req.params;
  if (!address || !address.trim()) {
    return res.status(400).json({ success: false, message: 'Wallet address is required.' });
  }
  next();
};

exports.validateSearchQuery = (req, res, next) => {
  const { wallet } = req.query;
  if (!wallet || !wallet.trim()) {
    return res.status(400).json({ success: false, message: 'Query parameter wallet is required.' });
  }
  next();
};
