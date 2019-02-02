const express = require("express");
const router = express.Router();
const UserController = require('../controllers/usersCon')
const authchecker = require("../middleware/check-auth");




// SIGNUP/REGISTER
router.post('/signup',UserController.registerUser)

// LOGIN
router.post("/login", UserController.userLogin);

//DELETE
router.delete('/:userId',  UserController.deleteUser)


module.exports = router;
