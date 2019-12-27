const express = require('express')
const router = express.Router();
const mongoose = require('mongoose')
const Order = require('./models/orders');
const Product = require('./models/product')

router.get('/',(req,res,next)=>{
Order.find()
.select('product quantity _id')
.exec()
.then(docs =>{
    res.status(200).json({
        count:docs.length,
        orders:docs.map(doc=>{
            return {
                _id:doc._id,
                product:doc.product,
                quantity:doc.quantity,
                request:{
                    type:"GET",
                    url:"http://localhost:3000/orders/"+doc._id
                }
            }
        })
    });
})
.catch(err =>{
    res.status(500).json({
        error:err
    });
})
    
});

router.post('/',(req,res,next)=>{
    Product.findById(req.body.productId)
    .then(product =>{
        if(!product){
            return res.status(404).json({
                message:"product not found"
            })
        }
        const order = new Order({
            _id:new mongoose.Types.ObjectId(),
            product:req.body.productId,
            quantity:req.body.quantity,     
        });
        return order.save()
    })
        .then(result=>{
            console.log(result);
            res.status(200).json({
                message:"order saved",
                createdOrder:{
                    _id:result._id,
                    product:result.product,
                    quantity:result.quantity
                    
                },
                request:{
                    type:"GET",
                    url:"http://localhost:3000/orders/"+result._id
                }
            })
        })
 
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            error:err
        });
    });
  
});

router.get('/:orderId',(req,res,next)=>{
        res.status(200).json({
            message:"order Details",
            orderId:req.params.orderId
        })
    

});

router.delete('/:orderId',(req,res,next)=>{
    res.status(200).json({
        message:"order was deleted",
        orderId:req.params.orderId
    });
});

module.exports = router;
