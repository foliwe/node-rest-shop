const express = require("express");
const router = express.Router();
const Order = require("../models/order");
const Product = require("../models/product");
const mongoose = require("mongoose");


//GET ORDERS
router.get("/", (req, res, nex) => {

  Order.find()
  .select('quantity product _id')
  .exec()
  .then( docs =>{
    res.status(201).json({
      count: docs.length,
      orders: docs.map(doc =>{
        return{
          _id: doc._id,
          qty: doc.quantity,
          product: doc.product,

          request:{
            type: 'GET',
            url: 'http://localhost:3000/orders/'+ doc._id
          }
        }
      })
    })
  })
  .catch(err =>{
    res.status(500).json({
      error: err
    })
  })
});


// CREAT ORDERS
router.post("/", (req, res, nex) => {
  Product.findById( req.body.productId)
  .then( product =>{
    if (!product){
      return  res.status(404).json({
        message: "Product not found"
      })
    }
    const order = new Order({
      product: req.body.productId,
      quantity: req.body.quantity
    });
    return order.save()
    
    })
    .then( result =>{
      res.status(201).json({
        message: 'New Order Created',
        createdOrder:{
          _id: result._id,
          product: result._id,
          quantity: result.quantity
  
        },
        request:{
          type: 'GET',
          url: 'http://localhost:3000/orders/' + result._id
        }
      });
  })
  .catch( err =>{
    console.log(err);
    res.status(500).json({
      error: err
    });
  });
  
});


// GET SINGLE ORDER
router.get("/:orderId", (req, res, nex) => {
 Order.findById(req.params.orderId)
 .select('product quantity _id')
 .exec()
 .then( order =>{
   if (!order) {
     return res.status(404).json({
       message: 'Order not found'
     })
   }
   res.status(200).json({
      orderObj: order,

      request:{
        type: 'GET',
        url: 'http://localhost:3000/orders'
      }
   })
 })
 .catch(err =>{
  res.status(500).json({
    error: err
  })
   //catchError(err)
 })
 
});

// DELETE ORDER
router.delete("/:orderId", (req, res, nex) => {
  Order.remove({_id: req.params.orderId})
  .exec()
  .then( order =>{
    res.status(200).json({
        message: 'Order deleted',
         url: 'http://localhost:3000/orders'
       
    })
  })
  .catch(err =>{
    res.status(500).json({
      error: err
    })
    //catchError(err)
  })
});
module.exports = router;


let catchError = function(err){
  res.status(500).json({
    error: err
  })
}