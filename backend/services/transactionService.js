const transactionModel = require('../models/transactionModel');
const hashGenerator = require('../utils/hashGenerator');
const balanceCalculator = require('../utils/balanceCalculator');
const { DEFAULT_PAGE_SIZE } = require('../config/constants');

exports.createTransaction = async ({ sender, receiver, amount }) => {
  const timestamp = new Date().toISOString();
  const transaction = transactionModel.create({ sender, receiver, amount, timestamp });
  transaction.hash = hashGenerator(transaction);
  await transactionModel.save(transaction);
  return transaction;
};

exports.getAllTransactions = async () => {
  const transactions = await transactionModel.findAll();
  return transactions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
};

exports.getTransactionById = async (id) => {
  return transactionModel.findById(id);
};

exports.verifyTransaction = async (id) => {
  const transaction = await transactionModel.findById(id);
  if (!transaction) return null;
  const expectedHash = hashGenerator(transaction);
  return expectedHash === transaction.hash;
};

exports.getWalletBalance = async (address) => {
  const transactions = await transactionModel.findAll();
  return balanceCalculator(transactions, address);
};

exports.getStatistics = async () => {
  const transactions = await transactionModel.findAll();
  const totalTransactions = transactions.length;
  const totalTransferred = transactions.reduce((sum, tx) => sum + tx.amount, 0);
  const highestTransaction = transactions.reduce((max, tx) => (tx.amount > max.amount ? tx : max), transactions[0] || null);
  const averageAmount = totalTransactions ? totalTransferred / totalTransactions : 0;
  const uniqueWallets = [...new Set(transactions.flatMap((tx) => [tx.sender, tx.receiver]))];

  return {
    totalTransactions,
    totalTransferred,
    highestTransaction,
    averageAmount,
    uniqueWallets: uniqueWallets.length
  };
};

exports.searchTransactions = async (wallet) => {
  const transactions = await transactionModel.findAll();
  return transactions.filter(
    (tx) => tx.sender.toLowerCase() === wallet.toLowerCase() || tx.receiver.toLowerCase() === wallet.toLowerCase()
  );
};

exports.deleteTransaction = async (id) => {
  return transactionModel.deleteById(id);
};
