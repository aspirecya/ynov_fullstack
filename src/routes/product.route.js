const express = require('express');
const router = express.Router();
const product = require('../controllers/product.controller');
const verifyAuth = require('../utils/verifyAuth');


router.post('/products/', product.create);
router.get('/products/', product.findAll);
router.get('/products/seller/', product.getUserProducts);
router.get('/products/:id/buyers/', product.getProductBuyers);
router.get('/products/buyer/:id', product.getBuyerProducts);
router.get('/products/:id/buyer/add', product.addBuyerToProduct);
router.get('/products/:id/buyer/contains', product.productHasBuyerId);
router.get('/product/:id', product.findById);
router.patch('/product/:id', verifyAuth, product.findByIdAndUpdate);
router.delete('/product/:id', verifyAuth, product.findByIdAndRemove);

module.exports = router;
