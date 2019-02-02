const express = require("express");
const router = express.Router();
const multer = require('multer');
const authchecker = require("../middleware/check-auth") 
const ProductsController = require("../controllers/productsCon") ;

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
router.get("/", ProductsController.getAllProducts);

//POST REQUEST
router.post("/", authchecker, upload.single('productImage'), ProductsController.createProduct);

//GET /:ID REQUEST
router.get("/:productId", ProductsController.getProduct);

// DELETE REQUEST
router.delete("/:productId", authchecker, ProductsController.deleteProduct);

// PATCH REQUEST
router.patch("/:productId", authchecker, ProductsController.updateProduct);

module.exports = router;

[
  {"propNme":"name","value":"Reamcast"}
]