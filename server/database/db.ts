import knex from 'knex';

const db = knex({
  client: 'pg',
  connection: {
    host: 'localhost',
    user: 'postgres',
    password: 'thaj100998',
    database: 'grocerydb',
  },
});

export default db;