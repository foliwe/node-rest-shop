const express = require("express");
const router = express.Router();
const User = require("../models/user");
const mongoose = require("mongoose");
const bcrypt = require('bcrypt')



// SIGNUP/REGISTER
router.post('/signup',(req,res, next)=>{
    User.find({email: req.body.email})
    .exec()
    .then(user =>{
        if(user.length >= 1){
            return res.status(422).json({
                message: 'Email already exit'
            })
        }else{
            bcrypt.hash(req.body.password, 10,(err, hash) =>{
                if (err){
                    return res.status(500).json({
                        error: err
                    })
                }else{
                    
                    const user = new User({
                        email: req.body.email,
                        password: hash
                    })
                    user.save()
                    .then(result =>{
                        console.log(result);
                        
                        res.status(201).json({
                            message: 'User created'
                        })
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).json({ error: err });
                      });
                }
            })
        }
    })
    
})


//DELETE
router.delete('/:userId',(req,res, next) =>{
    User.find({_id: req.params.userId})
    .exec()
    .then( user =>{
        if (user.length === 0) {
            return res.status(201).json({
                message: 'User not found'
            })
        }else{
            User.remove({_id: req.params.userId})
   
    .then( result =>{
        res.status(200).json({
            message: 'User deleted'
        })
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({ error: err });
      });
        }
    }
        
    )

    
})


module.exports = router;
