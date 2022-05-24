const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({

    name:{
        type:String,
        required:[true, 'Please Provide book name'],
        maxlength:[100, 'Book name should not be greater than 100 character']
    },
    price:{
        type:Number,
        required :[true, 'Please provide price of the book'],
    },
    
    published_on:{
        type:Date,
        required : [true, 'Please provide published date'],
    },

    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Author',
        required : [true, 'Author is required']
    }
});

module.exports = mongoose.model('Book', bookSchema);