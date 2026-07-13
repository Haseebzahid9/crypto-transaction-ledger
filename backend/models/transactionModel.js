const fs = require('fs').promises;
const { DATA_FILE } = require('../config/constants');
const idGenerator = require('../utils/idGenerator');

const readTransactions = async () => {
  try {
    const content = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
};

const writeTransactions = async (transactions) => {
  await fs.writeFile(DATA_FILE, JSON.stringify(transactions, null, 2), 'utf-8');
};

exports.create = ({ sender, receiver, amount, timestamp }) => {
  return {
    id: idGenerator(),
    sender: sender.trim(),
    receiver: receiver.trim(),
    amount: Number(amount),
    timestamp,
    hash: ''
  };
};

exports.findAll = async () => {
  return readTransactions();
};

exports.findById = async (id) => {
  const transactions = await readTransactions();
  return transactions.find((transaction) => transaction.id === id) || null;
};

exports.save = async (transaction) => {
  const transactions = await readTransactions();
  transactions.push(transaction);
  await writeTransactions(transactions);
};

exports.deleteById = async (id) => {
  const transactions = await readTransactions();
  const index = transactions.findIndex((transaction) => transaction.id === id);
  if (index === -1) return false;
  transactions.splice(index, 1);
  await writeTransactions(transactions);
  return true;
};
