require('dotenv').config()
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const mongoose = require("mongoose");
const productsRoutes = require("./api/routes/products");
const ordersRoutes = require("./api/routes/orders");

mongoose.connect(
  "mongodb://foliwe:"+ process.env.MONGO_DB_ATLAS+"@cluster0-shard-00-00-p6mvy.mongodb.net:27017,cluster0-shard-00-01-p6mvy.mongodb.net:27017,cluster0-shard-00-02-p6mvy.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true",
  { useNewUrlParser: true }
);

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-with, Content-Type,Accept, Authrization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT,POST, PATCH, DELETE,GET");
    return res.status(200).json({});
  }
  next();
});

app.use("/products", productsRoutes);
app.use("/orders", ordersRoutes);

app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

module.exports = app;
