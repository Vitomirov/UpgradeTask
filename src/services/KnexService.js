const { db } = require('../db/db');
const { HIERARCHY_BONUS_LEVELS } = require('../config/constants');

// Centralized Data Access Layer  for all application tables.
class KnexService {
    constructor() {
        this.tables = {
            users: 'users',
            products: 'products',
            purchases: 'purchases',
            bonuses: 'bonuses',
        };
    }

    
    // Adds a new user to the database.
    async addUser(name, referrerId) {
        // Returns the created object
        const [newUser] = await db(this.tables.users)
            .insert({ 
                name, 
                referrer_id: referrerId || null 
            })
            .returning(['id', 'name', 'referrer_id']);
            
        return newUser;
    }

    // Finds a user by their ID.
    async findUserById(userId) {
        return db(this.tables.users)
            .where('id', userId)
            .first();
    }

    // HIERARCHY (Upline)

    // Finds the sponsor line (upline) up to the maximum levels defined.
    // Uses a recursive query (CTE) for efficient traversal.
    async findUpline(userId) {
        if (!userId) {
            return [];
        }

        // Raw query for complex recursive hierarchy
        const upline = await db.raw(`
            WITH RECURSIVE upline_search AS (
                -- Anchor Member: Find the direct referrer
                SELECT 
                    id, 
                    referrer_id, 
                    1 AS level
                FROM users 
                WHERE id = (SELECT referrer_id FROM users WHERE id = ?) 
                
                UNION ALL
                
                -- Recursive Member: Move up one level
                SELECT 
                    u.id, 
                    u.referrer_id, 
                    us.level + 1 AS level
                FROM users u
                INNER JOIN upline_search us ON u.id = us.referrer_id
                WHERE us.level < ?
            )
            SELECT id, referrer_id, level
            FROM upline_search
            ORDER BY level ASC;
        `, [userId, HIERARCHY_BONUS_LEVELS]);

        // Returns rows from the raw query
        return upline.rows || [];
    }

    // PRODUCTS

    // Finds a product by its ID.
    async findProductById(productId) {
        return db(this.tables.products)
            .where('id', productId)
            .first();
    }

    // PURCHASES & BONUSES (Transaction)

    async createPurchaseAndBonuses(userId, productId, productPrice, referrerId, upline) {
        let newPurchase;

        // Use Knex transaction to ensure atomicity (all or nothing)
        await db.transaction(async (trx) => {
            // 1. Record the Purchase
            const [purchase] = await trx(this.tables.purchases)
                .insert({
                    user_id: userId,
                    product_id: productId,
                    amount: productPrice,
                })
                .returning('*');
            
            newPurchase = purchase;

            // Prepare bonus records
            const bonusRecords = [];
            const purchaseId = purchase.id;
            const scheduledAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour delay for Team Bonus

            // 2. Create Direct Bonus (10%) - Instant Payout (status: 'paid')
            if (referrerId) {
                const directBonusAmount = productPrice * REFERRAL_BONUS_PERCENTAGE;
                bonusRecords.push({
                    purchase_id: purchaseId,
                    recipient_id: referrerId,
                    type: 'direct', // Instant payout
                    amount: directBonusAmount,
                    status: 'paid', // Paid instantly, no worker needed
                    scheduled_at: new Date(), // Set to immediate time
                });
            }

            // 3. Create Team Bonuses (5%) - Delayed Payout (status: 'pending')
            const teamBonusAmountPerLevel = productPrice * TEAM_BONUS_PERCENTAGE;

            for (const uplineUser of upline) {
                // uplineUser.id is the recipient_id
                bonusRecords.push({
                    purchase_id: purchaseId,
                    recipient_id: uplineUser.id,
                    type: 'team',
                    amount: teamBonusAmountPerLevel,
                    status: 'pending',
                    scheduled_at: scheduledAt,
                });
            }

            // 4. Insert all bonuses (Direct + Team) in one go
            if (bonusRecords.length > 0) {
                await trx(this.tables.bonuses).insert(bonusRecords);
            }
        }); // Transaction automatically commits if successful or rolls back if error

        return newPurchase;
    }

    // Returns all team bonuses whose scheduled_at time has passed and status is 'pending'
async getPendingBonusesToPay() {
    return db(this.tables.bonuses)
        .where('status', 'pending')
        .andWhere('type', 'team')
        .andWhere('scheduled_at', '<=', new Date());
}

// Marks bonuses as paid by their IDs
async markBonusesAsPaid(ids) {
    if (!ids || ids.length === 0) return;
    await db(this.tables.bonuses)
        .whereIn('id', ids)
        .update({ status: 'paid', paid_at: new Date() });
}

    
}

// Export the singleton service instance
module.exports = new KnexService();