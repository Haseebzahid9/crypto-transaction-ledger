const transactionService = require('../services/transactionService');

exports.createTransaction = async (req, res, next) => {
  try {
    const transaction = await transactionService.createTransaction(req.body);
    res.status(201).json({
      success: true,
      message: 'Transaction created successfully',
      transaction
    });
  } catch (error) {
    next(error);
  }
};

exports.getAllTransactions = async (req, res, next) => {
  try {
    const transactions = await transactionService.getAllTransactions();
    res.json({ success: true, transactions });
  } catch (error) {
    next(error);
  }
};

exports.getTransactionById = async (req, res, next) => {
  try {
    const transaction = await transactionService.getTransactionById(req.params.id);
    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }
    res.json({ success: true, transaction });
  } catch (error) {
    next(error);
  }
};

exports.verifyTransaction = async (req, res, next) => {
  try {
    const verified = await transactionService.verifyTransaction(req.params.id);
    if (verified === null) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }
    res.json({ success: true, verified });
  } catch (error) {
    next(error);
  }
};

exports.exportTransactions = async (req, res, next) => {
  try {
    const transactions = await transactionService.getAllTransactions();
    res.setHeader('Content-Type', 'application/json');
    res.json({ success: true, transactions });
  } catch (error) {
    next(error);
  }
};

exports.getWalletBalance = async (req, res, next) => {
  try {
    const walletReport = await transactionService.getWalletBalance(req.params.address);
    res.json({ success: true, wallet: walletReport });
  } catch (error) {
    next(error);
  }
};

exports.getStatistics = async (req, res, next) => {
  try {
    const stats = await transactionService.getStatistics();
    res.json({ success: true, stats });
  } catch (error) {
    next(error);
  }
};

exports.searchTransactions = async (req, res, next) => {
  try {
    const { wallet } = req.query;
    const results = await transactionService.searchTransactions(wallet);
    res.json({ success: true, transactions: results });
  } catch (error) {
    next(error);
  }
};

exports.deleteTransaction = async (req, res, next) => {
  try {
    const deleted = await transactionService.deleteTransaction(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }
    res.json({ success: true, message: 'Transaction deleted successfully' });
  } catch (error) {
    next(error);
  }
};
