var express = require('express');
var router = express.Router();
const usersController = require('../../api/controllers/users');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.json({'message': 'working'});
});

module.exports = router;
