const KnexService = require('../services/KnexService');
const { WORKER_INTERVAL_MS } = require('../config/constants');

class BonusWorker {
    constructor() {
        this.interval = WORKER_INTERVAL_MS || 60000;
        this.isRunning = false;
        this.timer = null;
    }

    async process() {
        if (this.isRunning) return;
        this.isRunning = true;

        try {
            await KnexService.testConnection();
            const bonusesToPay = await KnexService.getPendingBonusesToPay();
            if (!bonusesToPay.length) return;

            const bonusIds = bonusesToPay.map(b => b.id);
            await KnexService.markBonusesAsPaid(bonusIds);

            console.log(`Bonus Worker: successfully paid ${bonusesToPay.length} bonuses: [${bonusIds.join(', ')}]`);
        } catch (err) {
            if (err.message.includes('DB not ready')) {
                console.log('Bonus Worker: DB not ready, retrying in 1s...');
                setTimeout(() => this.process(), 1000);
            } else {
                console.error('Bonus Worker processing failed:', err);
            }
        } finally {
            this.isRunning = false;
        }
    }

    start() {
        if (this.timer) return;

        const startupDelay = 5000;
        setTimeout(() => {
            this.process();
            this.timer = setInterval(() => this.process(), this.interval);
            console.log(`Bonus Worker started, running every ${this.interval / 1000}s.`);
        }, startupDelay);
    }

    stop() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
            console.log('Bonus Worker stopped.');
        }
    }
}

module.exports = new BonusWorker();
