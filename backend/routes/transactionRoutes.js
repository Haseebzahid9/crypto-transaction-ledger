const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const { validateTransactionBody, validateWalletAddress, validateSearchQuery } = require('../middleware/validation');

router.post('/transactions', validateTransactionBody, transactionController.createTransaction);
router.get('/transactions', transactionController.getAllTransactions);
router.get('/transactions/export', transactionController.exportTransactions);
router.get('/transactions/:id', transactionController.getTransactionById);
router.get('/transactions/:id/verify', transactionController.verifyTransaction);
router.delete('/transactions/:id', transactionController.deleteTransaction);
router.get('/wallet/:address', validateWalletAddress, transactionController.getWalletBalance);
router.get('/stats', transactionController.getStatistics);
router.get('/search', validateSearchQuery, transactionController.searchTransactions);

module.exports = router;
