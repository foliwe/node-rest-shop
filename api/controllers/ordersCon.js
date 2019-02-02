const Order = require("../models/order");
const Product = require("../models/product");

exports.get_all_orders =  (req, res, next) => {

    Order.find()
    .select('quantity product _id')
    .populate('product','name ')
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
              url: `http://localhost:${port}/orders/`+ doc._id
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
  }

  exports.get_single_order = (req, res, nex) => {
    Order.findById(req.params.orderId)
    .select('product quantity')
    .populate('product','name')
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
           url: `http://localhost:${port}/orders/`
         }
      })
    })
    .catch(err =>{
     res.status(500).json({
       error: err
     })
      //catchError(err)
    })
    
   }

  exports.create_new_order = (req, res, nex) => {
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
            url: `http://localhost:${port}/orders/` + result._id
          }
        });
    })
    .catch( err =>{
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
    
  }

   exports.delete_order = (req, res, nex) => {
    Order.remove({_id: req.params.orderId})
    .exec()
    .then( order =>{
      res.status(200).json({
          message: 'Order deleted',
           url: `http://localhost:${port}/orders/`
         
      })
    })
    .catch(err =>{
      res.status(500).json({
        error: err
      })
      
    })
  }