export async function up(knex) {
    await knex.schema.createTable('bonuses', (table) => {
        table.increments('id').primary();
        
        // Reference to the purchase that triggered this bonus
        table.integer('purchase_id').unsigned().notNullable();
        table.foreign('purchase_id').references('id').inTable('purchases').onDelete('CASCADE');

        // User who receives the bonus
        table.integer('recipient_id').unsigned().notNullable();
        table.foreign('recipient_id').references('id').inTable('users').onDelete('CASCADE');

        // Type of bonus: 'direct' (10%) or 'team' (5%)
        table.string('type').notNullable(); 
        
        // Bonus amount
        table.decimal('amount', 10, 2).notNullable();

        // Status: 'pending' (waiting for 1h delay) or 'paid' (processed/ready for payout)
        table.string('status').notNullable().defaultTo('pending'); 

        // CRITICAL FOR DELAY: The exact time the bonus should be paid
        table.timestamp('scheduled_at').notNullable(); 

        table.timestamp('created_at').defaultTo(knex.fn.now());
    });
}

export async function down(knex) {
    await knex.schema.dropTableIfExists('bonuses');
}