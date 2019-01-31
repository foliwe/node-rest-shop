const express = require("express");
const router = express.Router();
const Product = require("../models/product");
const mongoose = require("mongoose");

//GET ALL REQUEST
router.get("/", (req, res, next) => {
  Product.find()
    .exec()
    .then(data => {
      console.log(data);
      //   if (data.length >= 0) {
      res.status(200).json(data);
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
router.post("/", (req, res, next) => {
  const product = new Product({
    //_id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price
  });
  product
    .save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: "POST request from /products",
        createdProduct: result
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
    .exec()
    .then(data => {
      console.log("From database", data);
      if (data) {
        res.status(200).json(data);
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
      res.status(200).json(data);
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
    .then(data => {
      console.log(data);
      res.status(200).json(data);
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