const BigPromise = require('../middlewares/bigPromise');
const Author = require('../models/Author');
const { getAge } = require('../utils/util');
const CustomError = require('../utils/CustomError');


exports.getAllAuthor = BigPromise(async(req, res, next)=>{
    const authors  = await Author.find();
    res.status(200).json({
        success:true,
        messsage:'All user fetch successfully',
        authors,
    })

});

exports.createAuthor =  BigPromise(async (req, res, next) =>{
    const {name, dob} = req.body;

    if(!name || !dob){
        return next(new CustomError('Please provide name and dob', 400));
    }
    const age = getAge(dob);
    if(isNaN(age)){
        return next(new CustomError('Please provide dob in mm/dd/yyyy format'));
    }

    const author = await Author.create({
        name,
        dob,
        age
    })

    if(!author){
        return next(new CustomError('Unable to create author', 500));
    }
    res.status(200).json({
        success:true,
        message:'author created successfully',
        author,
    })

});