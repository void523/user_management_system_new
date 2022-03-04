/**
 * different routes for the admin
 */
var express = require('express');
var router = express.Router();
const controller = require('../controllers/user_controller');
const auth = require('../middlewares/validate-token');

router.post('/signup',controller.signUp);
router.post('/login',controller.login);
router.get('/:userId/:token',controller.emailVerify);
router.post('/reset',controller.reset);
router.post('/newPass',controller.newPassword);
router.get('/dashboard',auth.verifytoken,controller.dashboard);
module.exports = router;