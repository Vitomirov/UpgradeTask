exports.up = async function(knex) {
    await knex.schema.createTable('users', (table) => {
        table.increments('id').primary();
        table.string('name').notNullable();
        
        // Referrer ID: ID of the user who invited this user (Self-referencing Foreign Key)
        table.integer('referrer_id').unsigned().nullable(); 
        
        // Foreign Key constraint defining the UPLINE hierarchy
        table.foreign('referrer_id')
             .references('id')
             .inTable('users')
             .onDelete('SET NULL'); 
        
        table.timestamp('created_at').defaultTo(knex.fn.now());
    });
};

exports.down = async function(knex) {
    await knex.schema.dropTableIfExists('users');
};
