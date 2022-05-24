const express = require('express');

const router = express.Router();
const { isLoggedIn } = require('../middlewares/user');

const { 
    getAllAuthor,
    createAuthor } = require('../controllers/authorController');
router.get('/author/',isLoggedIn, getAllAuthor)
router.post('/author/',isLoggedIn, createAuthor);

module.exports = router;