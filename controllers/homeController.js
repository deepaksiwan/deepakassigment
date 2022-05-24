const BigPromise = require('../middlewares/bigPromise');

// using promise
exports.home =BigPromise(async (req,res) =>{
    res.status(200).json({
        success:true,
        greeting:"Hello from api",
    })
});

// using try catch
exports.login = async (req,res)=>{
    try{
    res.status(200).json({
        success:true,
        greeting:"Login Successfull",
    })}
    catch(error){
        console.log(error);
    }
}