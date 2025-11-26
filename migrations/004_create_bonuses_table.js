/**
 * @param { import("knex").Knex } knex
 */
export async function up(knex) {
  await knex.schema.createTable('bonuses', (table) => {
    table.increments('id').primary();
    table.integer('purchase_id').notNullable();
    table.integer('recipient_id').notNullable();
    table.string('type', 20).notNullable();
    table.decimal('amount', 10, 2).notNullable();
    table.string('status', 20).notNullable().defaultTo('pending');
    table.timestamp('scheduled_at').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
}

/**
 * @param { import("knex").Knex } knex
 */
export async function down(knex) {
  await knex.schema.dropTableIfExists('bonuses');
}
