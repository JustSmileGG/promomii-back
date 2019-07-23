const Express = require('express');

const { auth } = require('../controllers');

const router = Express.Router();
const authRoutes = Express.Router();

authRoutes.post('/register', auth.registerUser);
authRoutes.post('/register/confirm', auth.confirmEmail);
authRoutes.post('/login', auth.login);

router.use('/auth', authRoutes);

module.exports = router;
