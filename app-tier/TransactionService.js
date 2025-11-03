const dbcreds = require('./DbConfig');
const mysql = require('mysql');

// ✅ Create and connect MySQL connection
const con = mysql.createConnection({
  host: dbcreds.DB_HOST,
  user: dbcreds.DB_USER,
  password: dbcreds.DB_PWD,
  database: dbcreds.DB_DATABASE
});

con.connect(err => {
  if (err) {
    console.error('❌ MySQL connection failed:', err.message);
  } else {
    console.log('✅ MySQL connected successfully to database:', dbcreds.DB_DATABASE);
  }
});

function addTransaction(amount, desc) {
  const sql = `INSERT INTO transactions (amount, description) VALUES (?, ?)`;
  con.query(sql, [amount, desc], function (err, result) {
    if (err) {
      console.error('❌ Error inserting transaction:', err.message);
      return;
    }
    console.log('✅ Transaction added successfully');
  });
  return 200;
}

function getAllTransactions(callback) {
  const sql = 'SELECT * FROM transactions';
  con.query(sql, function (err, result) {
    if (err) {
      console.error('❌ Error retrieving transactions:', err.message);
      return callback([]);
    }
    console.log('✅ Retrieved all transactions');
    callback(result);
  });
}

function findTransactionById(id, callback) {
  const sql = 'SELECT * FROM transactions WHERE id = ?';
  con.query(sql, [id], function (err, result) {
    if (err) {
      console.error('❌ Error retrieving transaction:', err.message);
      return callback([]);
    }
    console.log(`✅ Retrieved transaction with id ${id}`);
    callback(result);
  });
}

function deleteAllTransactions(callback) {
  const sql = 'DELETE FROM transactions';
  con.query(sql, function (err, result) {
    if (err) {
      console.error('❌ Error deleting all transactions:', err.message);
      return callback([]);
    }
    console.log('✅ All transactions deleted');
    callback(result);
  });
}

function deleteTransactionById(id, callback) {
  const sql = 'DELETE FROM transactions WHERE id = ?';
  con.query(sql, [id], function (err, result) {
    if (err) {
      console.error('❌ Error deleting transaction:', err.message);
      return callback([]);
    }
    console.log(`✅ Deleted transaction with id ${id}`);
    callback(result);
  });
}

module.exports = {
  addTransaction,
  getAllTransactions,
  findTransactionById,
  deleteAllTransactions,
  deleteTransactionById
};
