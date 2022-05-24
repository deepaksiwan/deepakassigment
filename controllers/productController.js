
const BigPromise = require('../middlewares/bigPromise');
const Product = require('../models/Product');

exports.test = BigPromise(async(req, res, next)=>{
    res.status(200).json({
        success:true,
        message:'Product route is working fine',
    })
})