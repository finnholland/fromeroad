const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createPool({
    host: process.env.RDS_DB,
    port: 3306,
    user: process.env.RDS_USER,
    password: process.env.RDS_PASSWORD,
    database: "fromeroad",
    multipleStatements: true
});
module.exports = db;