const User = require('../models/User');
const BigPromise = require('./bigPromise');
const CustomError = require('../utils/CustomError')
const jwt = require('jsonwebtoken');

exports.isLoggedIn = BigPromise(async (req, res, next)=>{
    
    const token = req.cookies.token || req.header('Authorization')?.replace('Bearer ',"");
    
    if(!token){
        return next(new CustomError('Login first to access this page', 401 ));
    }

    const id = jwt.verify(token, process.env.JWT_SECRET).id;
    
    const user = await User.findById(id);
  
    req.user = user;
    console.log(req.user);
    next();

});


exports.customRole = (...roles) =>{
    return (req, res, next) =>{
        if(!roles.includes(req.user.role)){
            return next(new CustomError("You can't access this resources", 403));
        }
        next();
    }
   
}

// exports.managerRole = (...roles) => {
//     return (req, res, next) =>{
//         if(!roles.includes(req.user.role)){
//             return next(new CustomError("You can not access this resources", 403));
//         }
//         next();
//     }
// }