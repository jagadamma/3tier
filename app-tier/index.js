const transactionService = require('./TransactionService');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const os = require('os');
const fetch = require('node-fetch');

const app = express();
const port = 4000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({ origin: '*', methods: ['GET', 'POST', 'DELETE', 'PATCH'], allowedHeaders: ['Content-Type'] }));

// =======================================================
// 🩺 Health Check
// =======================================================
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Backend is healthy 🚀' });
});

// =======================================================
// ➕ ADD TRANSACTION
// =======================================================
app.post('/api/transaction', (req, res) => {
  try {
    const { amount, desc } = req.body;
    console.log("📥 Adding transaction:", req.body);

    const success = transactionService.addTransaction(amount, desc);
    if (success === 200) {
      res.status(200).json({ message: '✅ Transaction added successfully' });
    } else {
      res.status(400).json({ message: '⚠️ Transaction addition failed' });
    }
  } catch (err) {
    console.error("❌ Error adding transaction:", err);
    res.status(500).json({ message: 'Something went wrong', error: err.message });
  }
});

// =======================================================
// 📋 GET ALL TRANSACTIONS
// =======================================================
app.get('/api/transaction', (req, res) => {
  try {
    transactionService.getAllTransactions((results) => {
      const transactionList = results.map(row => ({
        id: row.id,
        amount: row.amount,
        description: row.description
      }));
      res.status(200).json({ result: transactionList });
    });
  } catch (err) {
    console.error("❌ Error getting transactions:", err);
    res.status(500).json({ message: 'Could not get all transactions', error: err.message });
  }
});

// =======================================================
// ❌ DELETE ALL TRANSACTIONS
// =======================================================
app.delete('/api/transaction', (req, res) => {
  try {
    transactionService.deleteAllTransactions(() => {
      res.status(200).json({ message: '🗑️ All transactions deleted successfully' });
    });
  } catch (err) {
    console.error("❌ Error deleting all transactions:", err);
    res.status(500).json({ message: 'Deleting all transactions failed', error: err.message });
  }
});

// =======================================================
// ❌ DELETE ONE TRANSACTION BY ID
// =======================================================
app.delete('/api/transaction/:id', (req, res) => {
  try {
    const id = req.params.id;
    console.log("🗑️ Deleting transaction with ID:", id);
    transactionService.deleteTransactionById(id, () => {
      res.status(200).json({ message: `Transaction with id ${id} deleted` });
    });
  } catch (err) {
    console.error("❌ Error deleting transaction:", err);
    res.status(500).json({ message: 'Error deleting transaction', error: err.message });
  }
});

// =======================================================
// 🔍 GET SINGLE TRANSACTION BY ID
// =======================================================
app.get('/api/transaction/:id', (req, res) => {
  try {
    const id = req.params.id;
    transactionService.findTransactionById(id, (result) => {
      if (!result || result.length === 0) {
        return res.status(404).json({ message: `Transaction with id ${id} not found` });
      }

      const row = result[0];
      res.status(200).json({
        id: row.id,
        amount: row.amount,
        description: row.description
      });
    });
  } catch (err) {
    console.error("❌ Error retrieving transaction:", err);
    res.status(500).json({ message: 'Error retrieving transaction', error: err.message });
  }
});

// =======================================================
// 🚀 Start the Server
// =======================================================
app.listen(port, '0.0.0.0', () => {
  console.log(`✅ AB3 backend running on http://0.0.0.0:${port}`);
});
