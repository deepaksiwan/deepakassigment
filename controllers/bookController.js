const BigPromise = require('../middlewares/bigPromise');
const Book = require('../models/Book');
const CustomeError = require('..//utils/CustomError');

exports.createBook = BigPromise(async (req, res, next)=>{

    const{name, price, published_on, author} = req.body;

    if(!name || !price || !published_on || !author){
        return next(new CustomeError("Please Provide Required field", 400));
    }

    const book = await Book.create({
        name,
        price,
        published_on,
        author,
    })

    if(!book){
        return next(new CustomeError("Unable to create book", 500));
    }
    res.status(200).json({
        success:true,
        message:'Book create successfully',
        book
    })

});


exports.getAllBook = BigPromise(async (req, res, next)=>{

    const books  = await Book.find().populate('author');
    res.status(200).json({
        success:true,
        message:'Book fetch successfully',
        books
    })

});


exports.deleteBook = BigPromise(async (req, res, next)=>{

    const book = await Book.findById(req.params.id);
    if(!book){
        return next(new CustomeError('Invalid book id', 400));
    }

    await book.remove();

    res.status(200).json({
        success:true,
        message:'book deleted successfully',
        book
    })

});