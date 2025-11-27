const KnexService = require('../services/KnexService');

// Handles user creation and upline retrieval logic
class UserController {

    // Adds a new user to the platform.
    async addUser(req, res) {
        const { name, referrer_id } = req.body; 

        // 1.Input Validation
        if (!name || typeof name !== 'string') {
            return res.status(400).json({ error: 'Name is required and must be a string.' });
        }

        if (referrer_id) {
            if (isNaN(parseInt(referrer_id)) || parseInt(referrer_id) <= 0) {
                return res.status(400).json({ error: 'Invalid referrer_id.' });
            }
            //2. Referrer existence check
            const referrer = await KnexService.findUserById(referrer_id);
            if (!referrer) {
                return res.status(404).json({ error: `Referrer with ID ${referrer_id} not found.` });
            }
        }

        try {
            //3. Create user in DB
            const newUser = await KnexService.addUser(name, referrer_id);
            
            return res.status(201).json({
                message: 'User created successfully.',
                user: {
                    id: newUser.id,
                    name: newUser.name,
                    referrer_id: newUser.referrer_id
                }
            });
        } catch (error) {
            console.error('Error creating user:', error);
            return res.status(500).json({ error: 'Internal server error while creating user.' });
        }
    }
    // Retrieves user details along with upline hierarchy.
    async getUserDetails(req, res) {
        const userId = parseInt(req.params.id);

        if (isNaN(userId) || userId <= 0) {
            return res.status(400).json({ error: 'Invalid user ID.' });
        }

        try {
            const user = await KnexService.findUserById(userId);

            if (!user) {
                return res.status(404).json({ error: `User with ID ${userId} not found.` });
            }

            const upline = await KnexService.findUpline(userId);

            return res.status(200).json({
                user: {
                    id: user.id,
                    name: user.name,
                    referrer_id: user.referrer_id,
                },
                upline_hierarchy: upline.map(u => ({ id: u.id, level: u.level }))
            });

        } catch (error) {
            console.error('Error fetching user details:', error);
            return res.status(500).json({ error: 'Internal server error while fetching user.' });
        }
    }
}

module.exports = new UserController();