export async function seed(knex) {
  // NOTE: This seed file adds two initial products to the 'products' table.
  
  // Deletes ALL existing entries in the 'products' table to ensure idempotency
  await knex.raw('TRUNCATE TABLE products RESTART IDENTITY CASCADE');

  // Seed products
  await knex('products').insert([
    { 
      id: 1, 
      name: 'Package 1', 
      price: 100.00 
    },
    { 
      id: 2, 
      name: 'Package 2', 
      price: 500.00 
    }
  ]);

  console.log('Package 1 and Package 2 have been added to the products table.');
}