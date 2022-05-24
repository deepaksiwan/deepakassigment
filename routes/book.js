const express = require('express');

const router = express.Router();

const { createBook, getAllBook, deleteBook } = require('../controllers/bookController');
const { isLoggedIn } = require('../middlewares/user');

router.post('/book/create',isLoggedIn, createBook);
router.get('/book/',isLoggedIn, getAllBook);
router.delete('/book/:id/',isLoggedIn, deleteBook);

module.exports = router;