exports.up = async function(knex) {
    await knex.schema.createTable('products', (table) => {
        table.increments('id').primary();
        table.string('name').notNullable();
        table.decimal('price', 10, 2).notNullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());
    });
};

exports.down = async function(knex) {
    await knex.schema.dropTableIfExists('products');
};
