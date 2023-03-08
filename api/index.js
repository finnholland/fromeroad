const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createPool({
    // host: 'fromeroad.cpeo21gqc8br.ap-southeast-2.rds.amazonaws.com',
    host: "localhost",
    port: 3306,
    user: "fromeroadadmin",
    password: "Sp3ndin*minEcraft+gBo0ted2-WisTfuL8",
    // password: "Swear-Paci#fier7-SliCEd",
    database: "fromeroad",
    multipleStatements: true
});
module.exports = db;