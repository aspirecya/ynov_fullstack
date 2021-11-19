const express = require('express');
const router = express.Router();
const user = require('../controllers/user.controller');
const verifyAuth = require('../utils/verifyAuth');
const verifyPerm = require('../utils/verifyPerm');


router.get('/user/isAdmin', user.isAdmin);
router.post('/users', user.create);
router.get('/users', verifyAuth, user.findAll);
router.get('/user', verifyAuth, user.findByToken);
router.get('/user/:id', verifyPerm, user.findById);
router.patch('/user/:id?', verifyAuth, user.findAndUpdate);
router.delete('/user/:id', verifyAuth, user.findByIdAndRemove);

module.exports = router;