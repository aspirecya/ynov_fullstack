const express = require('express');
const router = express.Router();
const category = require('../controllers/category.controller');
const verifyAuth = require('../utils/verifyAuth');


router.post('/categories/', category.create);
router.get('/categories/', category.findAll);
router.patch('/category/:id', verifyAuth, category.findByIdAndUpdate);
router.delete('/category/:id', verifyAuth, category.findByIdAndRemove);

module.exports = router;
