export async function up(knex) {
    await knex.schema.createTable('purchases', (table) => {
        table.increments('id').primary();
        
        table.integer('user_id').unsigned().notNullable();
        table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE'); 
        
        table.integer('product_id').unsigned().notNullable();
        table.foreign('product_id').references('id').inTable('products').onDelete('RESTRICT'); 

        table.decimal('amount', 10, 2).notNullable(); 
        
        table.timestamp('purchased_at').defaultTo(knex.fn.now());
    });
}

export async function down(knex) {
    await knex.schema.dropTableIfExists('purchases');
}