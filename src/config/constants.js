// Centralized storage for all fixed values and business rules for the MLM hierarchy and bonus system.

// Product IDs initially inserted into the `products` table, 
export const PRODUCT_IDS = {
    PACKAGE_1: 1,
    PACKAGE_2: 2,
};

//Fixed product prices used for bonus calculations.
export const PRODUCT_PRICES = {
    PACKAGE_1: 100.00,
    PACKAGE_2: 500.00,
};

// Referral Bonus
export const REFERRAL_BONUS_PERCENTAGE = 0.10;

// TEAM BONUS
export const TEAM_BONUS_PERCENTAGE = 0.05;

//The depth of the hierarchy
export const HIERARCHY_BONUS_LEVELS = 5;


//Interval in milliseconds for the bonus processing worker. 
export const WORKER_INTERVAL_MS = 60000;