const express = require('express')
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


mongoose.Promise = global.Promise;
//import  the routes
const productsRoutes = require('./api/routes/products')
const ordersRoutes = require('./api/routes/orders')

mongoose.connect('mongodb+srv://iggies:'+process.env.MONGO_ATLAS_PW+ '@cluster0-faxa7.mongodb.net/test?retryWrites=true&w=majority',{
    
    useNewUrlParser:true,
    useUnifiedTopology:true
})
mongoose.connection.once('open', () => {
    console.log('Connected to database');
  });
//middlewares
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

app.use('/products',productsRoutes)
app.use('/orders',ordersRoutes)

//protection against cors error
app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Header','Origin,  X-Requested-With, Content-Type, Accept, Authorization');
    if(req.method === 'OPTION'){
        res.header('Access-Control-Allow-Methods', 'PUT, POST , PATCH ,DELETE, GET');
        return res.status(200).json({});
    }
    next(error);
});

//handling error
app.use((req,res,next)=>{
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((error,req,res,next)=>{
    res.status(error.status || 500);
    res.json({
        error:{
            message:error.message
        }
    })
})



module.exports = app;