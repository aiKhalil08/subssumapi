var express = require('express');
var router = express.Router();
const { expressjwt: jwt } = require("express-jwt");
const usersController = require('../controllers/users');

const authMiddleware = jwt({
    secret: 'subssum_jwt_key',
    algorithms: ["HS256"]
});


router.post('/', (req, res) => {
    return res.json({'message': 'hi'})
});
router.post('/register',  usersController.register);
router.post('/login', usersController.login);
router.post('/change-password', authMiddleware, usersController.changePassword);
router.post('/change-pin', authMiddleware, usersController.changePin);
router.get('/transactions', authMiddleware, usersController.getAllTransactions);
router.post('/airtime-to-cash', authMiddleware, usersController.airtimeToCash);

module.exports = router;