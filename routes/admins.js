var express = require('express');
var router = express.Router();
const controller = require('../controllers/admin_controller');
const auth = require('../middlewares/validate-token');

router.post('/signup',controller.signUp);
router.post('/login',controller.login);
router.get('/dashboard',auth.verifytoken,controller.dashboard);
router.get('/dashboard/users',controller.getAllUsers);
router.get('/dashboard/:userId',controller.getUserById);
router.patch('/dashboard/:userId',controller.updateUserById);
router.delete('/dashboard/:userId',controller.deleteUserById);

module.exports = router;