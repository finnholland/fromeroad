const mysql = require('mysql2');

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "toor",
    database: "fromeroad",
    multipleStatements: true
});
module.exports = db;