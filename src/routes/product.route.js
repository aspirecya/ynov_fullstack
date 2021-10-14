const express = require('express');
const router = express.Router();

const product = require('../controllers/product.controller');

const verifyAuth = require('../utils/verifyAuth');
const verifyPerm = require('../utils/verifyPerm');

router.post('/products/', product.create);
router.get('/products/', verifyAuth, product.findAll);
router.get('/product/:id', verifyAuth, product.findById);
router.patch('/product/:id', verifyAuth, product.findByIdAndUpdate);
router.delete('/product/:id', verifyAuth, product.findByIdAndRemove);
router.get('/products/categories', verifyAuth, product.getAllCategories);

module.exports = router;