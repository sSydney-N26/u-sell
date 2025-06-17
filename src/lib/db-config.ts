import mysql from "mysql2/promise";

const pool = mysql.createPool({
    host: "localhost",
    user: "admin",
    password: "admin1!",
    database: "u_sell",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0   // We can queue as many requests as possible

})

export default pool;
