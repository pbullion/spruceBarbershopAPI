const { Pool } = require('pg');
/*
const { user, host, database, password, port } = require('../secrets/db_configuration');
*/

const pool = new Pool({
    user: 'spruce_admin',
    host: 'sprucebarbershopdb.cluysew5vnmx.us-west-2.rds.amazonaws.com',
    database: 'postgres',
    password: 'spruceBarberShop483904857238398475987349845738',
    port: 5432
});

module.exports = pool;
