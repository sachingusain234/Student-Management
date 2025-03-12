const mysql = require('mysql2/promise');
require('dotenv').config();
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME || 'school_management',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
})
async function testConnection(){
    try{
        const connection = await pool.getConnection();
        console.log('Database connected');
        connection.release();
    }catch(err){
        console.log('Database connection failed');
        process.exit(1);
    }
}
module.exports = {pool, testConnection};   