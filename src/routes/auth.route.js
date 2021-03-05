const express = require('express');
const router = express.Router();
const auth = require('../controllers/auth.controller');
const verifyAuth = require("../utils/verifyPerm");


router.post('/auth/register', auth.register);
router.post('/auth/login', auth.login);

module.exports = router;