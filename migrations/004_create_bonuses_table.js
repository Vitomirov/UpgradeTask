exports.up = async function(knex) {
  await knex.schema.createTable('bonuses', (table) => {
    table.increments('id').primary();

    table.integer('purchase_id').unsigned().notNullable();
    table.foreign('purchase_id').references('id').inTable('purchases').onDelete('CASCADE');

    table.integer('recipient_id').unsigned().notNullable();
    table.foreign('recipient_id').references('id').inTable('users').onDelete('CASCADE');

    table.string('type').notNullable();
    table.decimal('amount', 10, 2).notNullable();
    table.string('status').notNullable().defaultTo('pending');
    
    table.timestamp('scheduled_at').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

exports.down = async function(knex) {
  await knex.schema.dropTableIfExists('bonuses');
};
