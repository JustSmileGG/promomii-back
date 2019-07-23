const Express = require('express');

const authRouter = require('./auth');

const router = Express.Router();
const mainRouter = Express.Router();

mainRouter.use(authRouter);

router.use('/api/v1', mainRouter);

module.exports = router;
