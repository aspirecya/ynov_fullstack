const express = require('express');
const router = express.Router();
const category = require('../controllers/category.controller');
const verifyPerm = require('../utils/verifyPerm');


router.post('/categories/', verifyPerm, category.create);
router.get('/categories/', category.findAll);
router.patch('/category/:id', verifyPerm, category.findByIdAndUpdate);
router.delete('/category/:id', verifyPerm, category.findByIdAndRemove);

module.exports = router;
