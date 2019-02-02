const express = require("express");
const router = express.Router();
const authchecker = require("../middleware/check-auth");
const Orderscontroller = require("../controllers/ordersCon") ;


//GET ORDERS
router.get("/",authchecker, Orderscontroller.get_all_orders);

// CREAT ORDERS
router.post("/", authchecker,Orderscontroller.create_new_order);


// GET SINGLE ORDER
router.get("/:orderId", authchecker, Orderscontroller.get_single_order);

// DELETE ORDER
router.delete("/:orderId", authchecker, Orderscontroller.delete_order);
module.exports = router;


let catchError = function(err){
  res.status(500).json({
    error: err
  })
}