const express = require('express');
const router = express.Router();
const user = require('../controllers/user.controller');
const verifyAuth = require('../utils/verifyAuth');


router.post('/users/', user.create);
router.get('/users/', verifyAuth, user.findAll);
router.get('/user/:id', verifyAuth, user.findById);
router.patch('/user/:id', verifyAuth, user.findByIdAndUpdate);
router.delete('/user/:id', verifyAuth, user.findByIdAndRemove);
router.get('/user/', user.findWithToken)

module.exports = router;