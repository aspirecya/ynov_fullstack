const express = require('express');
const router = express.Router();
const user = require('../controllers/user.controller');
const verifyAuth = require('../utils/verifyAuth');


router.post('/users', user.create);
router.get('/users', verifyAuth, user.findAll);
router.get('/user', verifyAuth, user.findByToken);
router.patch('/user', verifyAuth, user.findByTokenAndUpdate);
router.delete('/user/:id', verifyAuth, user.findByIdAndRemove);

module.exports = router;