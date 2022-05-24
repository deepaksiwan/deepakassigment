const User = require('../models/User');
const BigPromise = require('../middlewares/bigPromise');
const CustomError = require('../utils/CustomError');
const cookieToken = require('../utils/cookieToken');
const fileUpload = require('express-fileupload');
const cloudinary = require('cloudinary');
const mailHelper = require('../utils/mailHelper');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');


exports.signup = BigPromise(async (req, res, next)=>{

    let imageUploadResult;
    if(req.files){
        // name attribute value should be photo
        let file = req.files.photo;
        imageUploadResult = await cloudinary.v2.uploader.upload(file.tempFilePath, {
            folder : "users",
            width : 150,
            crop : "scale"
        });
    }

    const {name, email, password} = req.body;

    if(!email || !name || !password){
        return next(new CustomError("Name, email, and password are required", 400))
    }

    const isUserAlreadyExist = await User.findOne({email:email})

    if(isUserAlreadyExist){
       return next(new CustomError("Email already exist", 400)); 
    }

    if(!imageUploadResult){
        return next(new CustomError("Image Upload failed", 500));
    }
    
    const user = await User.create({
        name,
        email,
        password,
        photo : {
            id : imageUploadResult.public_id,
            secure_url : imageUploadResult.secure_url,
        }
    });

    cookieToken(res, user);
   
    
});

exports.login = BigPromise(async(req, res, next)=>{
    const {email, password} = req.body;
    
    // checking if user provided email and password or not
    if(!email || !password){
        return next(new CustomError('Please provide email and password', 400));
    }

    // getting user for given email id
    const user = await User.findOne({email}).select('+password');

    // cheking if user exist in our database or not
    if(!user){
        return next(new CustomError('Invalid Email/Password', 400));
    }
    
    // checking if password is valid or not
    const isValidUser = await user.isValidatedPassword(password);
   
    if(!isValidUser){
        return next(new CustomError('Invalid Email/Password', 400));
    }
    // If everything is okay then good to go sending response to user
    cookieToken(res, user)
});

exports.logout = BigPromise( (req, res, next) =>{
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly:true,
    });
    res.status(200).json({
        success:true,
        message:'Logout Success'
    });
});

exports.forgotPassword = BigPromise(async(req, res, next)=>{
    const {email} = req.body;
    
    // checking if user provided email and password or not
    if(!email){
        return next(new CustomError('Please provide email', 400));
    }

    // getting user for given email id
    const user = await User.findOne({email});

    if(!user){
        return next(new CustomError('Email not found as registered'));
    }

    const forgotToken = user.getForgotPasswordToken();

    await user.save({validateBeforeSave:false});

    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/password/reset/${forgotToken}`;
    const message = `copy paste this link in your url bar and hit enter \n\n ${resetUrl}`;

    try{
        await mailHelper({
            toEmail:user.email,
            subject:"Cozy-Ecom@Reset Password",
            message:message,
        })
        res.status(200).json({
            success:true,
            message:'Mail has sent to your registered email.'
        })
    }catch(error){
        user.forgotPasswordToken = undefined;
        user.forgotPasswordExpiry = undefined;
        await user.save({validateBeforeSave:false});
        return next(new CustomError(error.message, 500));
    }

    
});

exports.resetPassword = BigPromise(async(req, res, next)=>{

    const token = req.params.token;

    if(!token){
        return next(new CustomError('Invalid Token/Expired', 402));
    }

    const encryptedToken = crypto.createHash('sha256')
                            .update(token)
                            .digest('hex');
    
    const user =await User.findOne({
        forgotPasswordToken:encryptedToken,
        forgotPasswordExpiry:{$gt : Date.now()},
    })

    if(!user){
        return next(new CustomError('Invalid Token/Expired', 402));
    }

    const password = req.body.password;
    
    if(!password){
        return next(new CustomError('Please Provide Password', 402));
    }
    user.forgotPasswordToken = undefined;
    user.forgotPasswordExpiry = undefined;
    user.password = password;
    await user.save()

    cookieToken(res, user);

})

exports.getLoggedInUserDetails = BigPromise(async(req, res, next)=>{

    const user = await User.findById(req.user.id);
    
    res.status(200).json({
        success:true,
        user
    });

})


exports.updatePassword = BigPromise(async(req, res, next)=>{
    const {oldPassword, password} = req.body;
    if(!oldPassword || !password){
        return next(new CustomError('Please Provide old password and password', 400));
    }

    const user = await User.findById(req.user._id).select("+password");

    
    const isValidPassword = await user.isValidatedPassword(oldPassword);

    if(!isValidPassword){
        return next(new CustomError('Invalid Password', 400));
    }

    user.password = password;
    await user.save();

    res.status(200).json({
        success:'true',
        message: 'Password updated successfully',
    })
})

exports.updateUserDetails = BigPromise(async(req, res, next)=>{
    
    const {name, email} = req.body;
    if(!name || !email){
        return next(new CustomError("Please provide name and email"));
    }


    const newData = {
       name,
       email
    };

    if(req.body.photo !== ''){

        const user = await User.findById(req.user._id);

        const deletePhoto = cloudinary.v2.uploader.destroy(user.photo.id);

        let file = req.files.photo;
        let imageUploadResult = await cloudinary.v2.uploader.upload(file.tempFilePath, {
            folder : "users",
            width : 150,
            crop : "scale"
        });

        if(!imageUploadResult){
            return next(new CustomError('Image upload Failed', 500));
        }
        newData.photo = {
            id : imageUploadResult.public_id,
            secure_url: imageUploadResult.secure_url,
            
        }
    }

    const user = await User.findByIdAndUpdate(req.user._id, newData, {
        new:true, // return updated user 
        runValidators:true,
        useFindAndModify:false,
    });

    res.status(200).json({
        success : true,
        user,
    });

});


exports.getUsers = BigPromise(async (req, res, next) =>{
    const users = await User.find();

    res.status(200).json({
        success:true,
        users,
    })
});

exports.getUser = BigPromise(async(req, res, next)=>{

    

    const user = await User.findById( req.params.id );
    if(!user){
        return next(new CustomError("No user found with given email"));
    }

    res.status(200).json({
        success:true,
        user,
    })

})

exports.adminUpdateOneUser = BigPromise(async(req, res, next)=>{

    const {name, email, role} = req.body;
    if(!name || !email || !role){
        return next(new CustomError("Please provide name and email"));
    }

    const newData = {
       name,
       email,
       role
    };   

    const user = await User.findByIdAndUpdate(req.params.id, newData, {
        new:true, // return updated user 
        runValidators:true,
        useFindAndModify:false,
    });

    res.status(200).json({
        success : true,
        user,
    });
});

exports.adminDeleteOneUser = BigPromise(async (req, res, next) =>{
   
    const user = await User.findById(req.params.id);
    
    if(!user){
        return next(new CustomError('User not found', 401));
    }

    await cloudinary.v2.uploader.destroy(user.photo.id);    
   
    await user.remove();
    
    res.status(200).json({
        success:true,
    })

})

exports.getAllUserByManager = BigPromise( async (req,res, next)=>{
    const users = await User.find({role:'user'}, {name:1, email:1});
    res.status(200).json({
        success:true,
        users,
    });
});
