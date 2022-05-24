const mongoose = require('mongoose');

const Product  = new mongoose.Schema({
    name:{
        type:String,
        maxlength:[120, 'Product Name should be less than 120 character'],
        required:[true, 'Product name is required'],
        trim:true,
    },

    price:{
        type:Number,
        maxlength:[6, 'Product price is less than 999999'],
        required:[true,'Product price is required'],        
    },

    description:{
        type:String,
        required:[true, "Product description is required"],
        maxlength:[500, 'Product description should be less than 500 character'],
    }


})


module.exports = mongoose.model('Product', Product);