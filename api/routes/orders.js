const express = require("express");
const router = express.Router();

router.get("/", (req, res, nex) => {
  res.status(200).json({
    message: "ORDER FETCHED"
  });
});

router.post("/", (req, res, nex) => {
  const order = {
    productId: req.body.productId,
    quantity: req.body.quantity
  };
  res.status(201).json({
    message: "ORDER Created",
    placedOrder: order
  });
});

router.get("/:orderId", (req, res, nex) => {
  const id = req.params.orderId;
  res.status(200).json({
    message: `ORDER ${id} FETCHED`
  });
});
router.delete("/:orderId", (req, res, nex) => {
  const id = req.params.orderId;
  res.status(200).json({
    message: `ORDER ${id} deleted`
  });
});
module.exports = router;
