
const Product = require("../models/product");
const multer = require('multer');
const port = process.env.PORT || 3000;
const siteUrl = 'https://sassnoderestapi.herokuapp.com'

 exports.getAllProducts = (req, res, next) => {
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
                url: `${siteUrl}/products/`+ doc.id 
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
  }

  exports.getProduct = (req, res, next) => {
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
               url: `${siteUrl}/products/`
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
  }

  exports.createProduct = (req, res, next) => {
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
            productImage: result.productImage,
            request:{
              type: 'GET',
              url: `${siteUrl}/products/`+ result._id
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
  }


  exports.updateProduct = (req, res, next) => {
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
              url: `${siteUrl}/products/`+ id
            }
         
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({ error: err });
      });
  }  

  exports.deleteProduct = (req, res, next) => {
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
  }
