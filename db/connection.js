const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password', 
  // database: ' not sure what goes here '
});

module.exports = db;