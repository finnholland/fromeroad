const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createPool({
    host: process.env.NODE_ENV+"_fromeroad_mysql",
    // host: "localhost",
    port: 3306,
    user: "admin",
    // password: process.env.RDS_PASSWORD,
    password: process.env.MYSQL_PASSWORD,
    database: "fromeroad",
    multipleStatements: true
});
module.exports = db;