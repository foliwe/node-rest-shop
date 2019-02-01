const express = require("express");
const router = express.Router();
const Product = require("../models/product");
const mongoose = require("mongoose");
const multer = require('multer');

const storageVar = multer.diskStorage({
  destination:function(req, file, cb){
    cb(null, './uploads/');
  },
  filename: function(req, file, cb){
 cb(null, new Date().toISOString() + file.originalname)
  }
})
const fileFilterVar = (req ,file, next) =>{
  if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') {
    next(null, true)
  }else{
    next(null,false)
  }
}
const upload = multer({storage: storageVar,
   limits:{
  fileSize: 5242880 
},
fileFilter: fileFilterVar
})

//GET ALL PRODUCTS
router.get("/", (req, res, next) => {
  Product.find()
  .select('name price _id productImage')
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        products: docs.map(doc =>{
          return {
            name: doc.name,
            price: doc.price,
            id: doc._id,
            productImage: doc.productImage,
            request:{

              type: 'GET',
              url: 'http://localhost:3000/products/'+ doc.id 
            }
          }
        })
      };
        
      res.status(200).json(response);
      //   } else {
      //     res.status(404).json({
      //       message: "No Record Found"
      //     });
      //   }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

//POST REQUEST
router.post("/", upload.single('productImage'),(req, res, next) => {
  console.log(req.file);
  
  const product = new Product({
    //_id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    productImage: req.file.path
  });
  product
    .save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: "Product Created Successfully",
        createdProduct: {
          _id: result._id,
          name: result.name,
          price: result.price,
          request:{
            type: 'GET',
            url: 'http://localhost:3000/products'+ result._id
          }
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

//GET /:ID REQUEST
router.get("/:productId", (req, res, next) => {
  const id = req.params.productId;
  Product.findById({ _id: id })
  .select('name price _id productImage')
    .exec()
    .then(result => {
      if (result) {
        res.status(200).json({
           product: result,
           request: {
             type: 'GET',
             url: 'http://localhost:3000/products'
           }
          
        });
      } else {
        res.status(404).json({ message: "Object not found" });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

// DELETE REQUEST
router.delete("/:productId", (req, res, next) => {
  const id = req.params.productId;
  Product.remove({ _id: id })
    .exec()
    .then(data => {
      res.status(200).json({
        message: 'Product deleted'
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

// PATCH REQUEST
router.patch("/:productId", (req, res, next) => {
  const id = req.params.productId;
  let updateOps = {};

  for(const ops of req.body){
    updateOps[ops.propName] = ops.value;
  }
  Product.update({ _id: id },{$set: updateOps})
    .exec()
    .then(result => {
      console.log(result);
      res.status(200).json({
       message: 'Product updates',
          request:{
            type: 'GET',
            url: 'http://localhost:3000/products/'+ id
          }
       
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

module.exports = router;

[
  {"propNme":"name","value":"Reamcast"}
]