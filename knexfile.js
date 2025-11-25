require('dotenv').config({ path: './.env' }); 

module.exports = {
  
  development: {
    client: 'pg',
    // ENV conection settings for PostgreSQL
    connection: {
      host: 'localhost',
      user: process.env.PG_USER,
      password: process.env.PG_PASSWORD,
      database: process.env.PG_DATABASE
    },
    // Migration path
    migrations: {
      directory: './migrations',
      tableName: 'knex_migrations', 
    },
    // Seeds path
    seeds: {
      directory: './seeds'
    }
  }
};