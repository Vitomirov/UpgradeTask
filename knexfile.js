require('dotenv').config({ path: './.env' });

module.exports = {
  development: {
    client: 'pg',
    connection: {
      host: process.env.PG_HOST || 'db',
      user: process.env.PG_USER || 'upgrade',
      password: process.env.PG_PASSWORD || 'upgrade123',
      database: process.env.PG_DATABASE || 'upgrade_db'
    },
    pool: { min: 2, max: 10 },
    migrations: {
      directory: './migrations',
      tableName: 'knex_migrations'
    },
    seeds: {
      directory: './seeds'
    }
  }
};
