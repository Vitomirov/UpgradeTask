const { db } = require('../db/db');
const { HIERARCHY_BONUS_LEVELS, REFERRAL_BONUS_PERCENTAGE, TEAM_BONUS_PERCENTAGE } = require('../config/constants');

class KnexService {
    constructor() {
        this.tables = {
            users: 'users',
            products: 'products',
            purchases: 'purchases',
            bonuses: 'bonuses',
        };
    }

    async addUser(name, referrerId) {
        const [newUser] = await db(this.tables.users)
            .insert({ name, referrer_id: referrerId || null })
            .returning(['id', 'name', 'referrer_id']);
        return newUser;
    }

    async findUserById(userId) {
        return db(this.tables.users).where('id', userId).first();
    }

    async findUpline(userId) {
        if (!userId) return [];

        const upline = await db.raw(`
            WITH RECURSIVE upline_search AS (
                SELECT id, referrer_id, 1 AS level
                FROM users 
                WHERE id = (SELECT referrer_id FROM users WHERE id = ?) 
                UNION ALL
                SELECT u.id, u.referrer_id, us.level + 1 AS level
                FROM users u
                INNER JOIN upline_search us ON u.id = us.referrer_id
                WHERE us.level < ?
            )
            SELECT id, referrer_id, level
            FROM upline_search
            ORDER BY level ASC;
        `, [userId, HIERARCHY_BONUS_LEVELS]);

        return upline.rows || [];
    }

    async findProductById(productId) {
        return db(this.tables.products).where('id', productId).first();
    }

    async createPurchaseAndBonuses(userId, productId, productPrice, referrerId, upline) {
        let newPurchase;

        await db.transaction(async trx => {
            const [purchase] = await trx(this.tables.purchases)
                .insert({ user_id: userId, product_id: productId, amount: productPrice })
                .returning('*');
            newPurchase = purchase;

            const bonusRecords = [];
            const purchaseId = purchase.id;
            const scheduledAt = new Date(Date.now() + 1 * 60 * 1000); // 1min delay

            // Direct bonus (instant payout)
            if (referrerId) {
                bonusRecords.push({
                    purchase_id: purchaseId,
                    recipient_id: referrerId,
                    type: 'direct',
                    amount: productPrice * REFERRAL_BONUS_PERCENTAGE,
                    status: 'paid',
                    scheduled_at: new Date(),
                });
            }

            // Team bonuses (delayed)
            const teamBonusAmount = productPrice * TEAM_BONUS_PERCENTAGE;
            for (const uplineUser of upline) {
                bonusRecords.push({
                    purchase_id: purchaseId,
                    recipient_id: uplineUser.id,
                    type: 'team',
                    amount: teamBonusAmount,
                    status: 'pending',
                    scheduled_at: scheduledAt,
                });
            }

            if (bonusRecords.length > 0) {
                await trx(this.tables.bonuses).insert(bonusRecords);
            }
        });

        return newPurchase;
    }

    async getPendingBonusesToPay() {
        return db(this.tables.bonuses)
            .where('status', 'pending')
            .andWhere('scheduled_at', '<=', new Date());
    }

    async markBonusesAsPaid(ids) {
        return db(this.tables.bonuses)
            .whereIn('id', ids)
            .update({ status: 'paid' });
    }

    async testConnection() {
        try {
            await db.raw('SELECT 1');
            return true;
        } catch (err) {
            throw new Error('DB not ready yet');
        }
    }
}

module.exports = new KnexService();
