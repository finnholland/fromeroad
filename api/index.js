const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createPool({
    host: process.env.NODE_ENV+"_fromeroad_mysql",
    // host: "localhost",
    port: 3306,
    user: "fromeroadadmin",
    password: "Sp3ndin*minEcraft+gBo0ted2-WisTfuL8",
    database: "fromeroad",
    multipleStatements: true
});
module.exports = db;