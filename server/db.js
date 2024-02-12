const { Pool } = require("pg")
require("dotenv").config();

// const pool = new Pool ({
//     user: 'guilas',
//     host: 'dpg-clpikt1oh6hc73c4eef0-a.oregon-postgres.render.com',
//     database: 'awesomechat_jdbs',
//     password: 'HnFzb5FG2BRyGNPZo4TETjWrjPSI7I80',
//     port: 5432,
//     ssl: true
// });

const pool = new Pool({
    user: process.env.USER_DB,
    host: process.env.HOST_DB,
    database: process.env.DATABASE,
    password: process.env.DB_PASS,
    port: process.env.port,
    ssl: true
})


module.exports = pool;