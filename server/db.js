// Setting up a Pool so that we can query the PostgreSQL database
const Pool = require("pg").Pool;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL, // heroku
    ssl: { rejectUnauthorized: false }
})

 module.exports = pool; // exports this code so that we can use it in index.js