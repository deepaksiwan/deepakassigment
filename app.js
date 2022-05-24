const express = require('express');

const app = express();
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');

// for swagger documentation
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocument = YAML.load('./swagger.yaml');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));  

// regular middleware

app.use(express.json());
app.use(express.urlencoded({extended:true}));

// cookies and file middleware

app.use(cookieParser());
app.use(fileUpload({
    useTempFiles :true,
    tempFileDir : 'temp/'
}));

// inject morgan before router
app.use(morgan("tiny"))

// imports all routes here
const home = require('./routes/home');
const user = require('./routes/user');
const product = require('./routes/product');
const author = require('./routes/author');
const book = require('./routes/book');



// router middleware
app.use('/api/v1',home);
app.use('/api/v1',user);
app.use('/api/v1', product);
app.use('/api/v1', author);
app.use('/api/v1', book);



// export app js
module.exports = app;