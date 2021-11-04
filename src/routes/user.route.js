const express = require('express');
const router = express.Router();
const user = require('../controllers/user.controller');
const verifyAuth = require('../utils/verifyAuth');
const verifyPerm = require('../utils/verifyPerm');


router.post('/users', user.create);
router.get('/users', verifyAuth, user.findAll);
router.get('/user', verifyAuth, user.findByToken);
router.get('/user/:id', verifyPerm, user.findById);
router.patch('/user/:id?', verifyAuth, user.findAndUpdate);
router.delete('/user/:id', verifyAuth, user.findByIdAndRemove);
router.get('/user/isAdmin', user.isAdmin);

module.exports = router;