const mongoose = require('mongoose');

const authorSchema = new mongoose.Schema({
    name : {

        type:String,
        required: [true, 'Please Provide Author name'],
        minlength :[4, 'Name length should be greater than 3'],
        maxlength :[30, 'Name length should not be greater than 30'],
        unique: [true, 'Author name should be unique/Author already exist']

    },
    dob : {
        type:Date,
        required:[true, 'Please provid dob']
    },

    age:{
        type:Number,
        
    }
    
})

module.exports = mongoose.model('Author', authorSchema);