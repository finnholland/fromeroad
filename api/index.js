const mysql = require('mysql2');

const db = mysql.createConnection({
    host: "118.210.47.238",
    port: 3306,
    user: "fromeroadadmin",
    password: "Sp3ndin*minEcraft+gBo0ted2-WisTfuL8",
    database: "fromeroad",
    multipleStatements: true
});
module.exports = db;