const dotenv = require('dotenv');
const mysql = require('mysql2');
dotenv.config();

var DBcon = mysql.createConnection({
    host : process.env.DB_host,
    user : process.env.DB_User,
    password : process.env.DB_Passwd,
    database : process.env.DB_name
});

module.exports = DBcon;