const mongoose = require('mongoose');

const connectWithDb = () => {mongoose.connect(process.env.DB_URL, {
    useNewUrlParser:true,
    useUnifiedTopology:true
    }).then(db=>{
        console.log("Database connected successfully");
    }).catch(err=>{
        console.log("Error in database connection" + err);
    })
}

module.exports = connectWithDb