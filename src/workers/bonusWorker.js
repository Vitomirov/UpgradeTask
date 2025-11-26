const KnexService = require('../services/KnexService');
const { WORKER_INTERVAL_MS } = require('../config/constants');

// Centralized logic for periodically processing delayed bonus payouts.
class BonusWorker {
    constructor() {
        // Interval is set in constants.js (default 60000ms = 1 minute)
        this.interval = WORKER_INTERVAL_MS;
        this.isRunning = false;
        this.timer = null;
    }

    // Main worker logic: finds and pays bonuses.
    async process() {
        if (this.isRunning) {
            console.log('Worker is currently processing. Skipping this interval.');
            return;
        }

        this.isRunning = true;
        
        try {
            // 1. Get all pending bonuses that are past their scheduled_at time
            const bonusesToPay = await KnexService.getPendingBonusesToPay();

            if (bonusesToPay.length === 0) {
                // console.log('Bonus Worker: No pending bonuses to pay.');
                this.isRunning = false;
                return;
            }

            console.log(`Bonus Worker found ${bonusesToPay.length} bonuses to pay.`);

            // Extract IDs for bulk update
            const bonusIds = bonusesToPay.map(b => b.id);

            // 2. Mark all found bonuses as 'paid' in a single transaction
            await KnexService.markBonusesAsPaid(bonusIds);
            
            console.log(`Bonus Worker successfully paid ${bonusesToPay.length} team bonuses.`);

        } catch (error) {
            console.error(' Failed Bonus Worker processing:', error);
        } finally {
            this.isRunning = false;
        }
    }

    // Starts the periodic worker process.
    start() {
        if (this.timer) {
            console.warn('Bonus Worker is already running.');
            return;
        }
        
        // Run immediately on start, then run on interval
        this.process();

        this.timer = setInterval(() => {
            this.process();
        }, this.interval);
        
        console.log(`Bonus Worker started. Running every ${this.interval / 1000} seconds.`);
    }

    // Stops the worker process.
    stop() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
            console.log('Bonus Worker stopped.');
        }
    }
}

module.exports = new BonusWorker();