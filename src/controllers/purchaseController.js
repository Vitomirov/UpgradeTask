const KnexService = require('../services/KnexService');
const { PRODUCT_PRICES } = require('../config/constants');
const { PRODUCT_IDS } = require('../config/constants');

// Handles purchase and bonus creation logic
class PurchaseController {


    // Processes a purchase and triggers bonus payouts.
    async processPurchase(req, res) {
        const { user_id, product_id } = req.body; 

        // 1. Input Validation
        if (!user_id || !product_id) {
            return res.status(400).json({ error: 'user_id and product_id are required.' });
        }

        const buyerId = parseInt(user_id);
        const prodId = parseInt(product_id);

        if (isNaN(buyerId) || isNaN(prodId)) {
            return res.status(400).json({ error: 'user_id and product_id must be valid numbers.' });
        }

        try {
            // 2. Data Retrieval (Buyer, Product, Upline)
            const buyer = await KnexService.findUserById(buyerId);
            if (!buyer) {
                return res.status(404).json({ error: `Buyer with ID ${buyerId} not found.` });
            }

            // Get product price based on ID (assuming fixed initial products)
            let productPrice;
            if (prodId === PRODUCT_IDS.PACKAGE_1) {
                productPrice = PRODUCT_PRICES.PACKAGE_1;
            } else if (prodId === PRODUCT_IDS.PACKAGE_2) {
                productPrice = PRODUCT_PRICES.PACKAGE_2;
            } else {
                // If product is not one of the two defined
                const product = await KnexService.findProductById(prodId);
                if (!product) {
                    return res.status(404).json({ error: `Product with ID ${prodId} not found.` });
                }
                productPrice = parseFloat(product.price);
            }

            // Get Upline (Recursive CTE query)
            const upline = await KnexService.findUpline(buyerId);

            // 3. Execute Transaction
            const purchase = await KnexService.createPurchaseAndBonuses(
                buyerId,
                prodId,
                productPrice,
                buyer.referrer_id,
                upline
            );
            
            // 4. Success Response
            return res.status(201).json({
                message: 'Purchase recorded and bonuses scheduled successfully.',
                purchase: {
                    id: purchase.id,
                    user_id: purchase.user_id,
                    amount: purchase.amount,
                    purchased_at: purchase.purchased_at
                },
                bonuses_info: 'Direct bonus (10%) paid instantly. Team bonus (5%) scheduled for 1 hour later.'
            });

        } catch (error) {
            console.error('Error processing purchase:', error);
            return res.status(500).json({ error: 'Internal server error while processing purchase.' });
        }
    }
}

module.exports = new PurchaseController();