const mysql = require('mysql2');
require('dotenv').config();
const db = mysql.createPool({
    host: process.env.ENV == 'local'     ? "localhost"                : process.env.RDS_DB, //make sure this exists when tf apply
    user: process.env.ENV == 'local'     ? "admin"                    : process.env.RDS_USER,
    password: process.env.ENV == 'local' ? process.env.MYSQL_PASSWORD : process.env.RDS_PASSWORD,
    
    port: 3306,
    database: "fromeroad",
    multipleStatements: true
});
module.exports = db;