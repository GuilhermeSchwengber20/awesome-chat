const { Pool } = require("pg")


const pool = new Pool ({
    user: 'guilas',
    host: 'dpg-clpikt1oh6hc73c4eef0-a.oregon-postgres.render.com',
    database: 'awesomechat_jdbs',
    password: 'HnFzb5FG2BRyGNPZo4TETjWrjPSI7I80',
    port: 5432,
    ssl: true
});

module.exports = pool;