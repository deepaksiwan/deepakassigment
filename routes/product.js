const express = require('express');
const router = express.Router();

const { test } = require('../controllers/productController');


router.get('/product/', test);


module.exports =  router;