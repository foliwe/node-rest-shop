const bcrypt = require('bcrypt');
const User = require("../models/user");
const jwt = require('jsonwebtoken');

exports.userLogin = (req, res, next) => {
    User.find({ email: req.body.email })
      .exec()
      .then(user => {
        if (user.length < 1) {
          return res.status(401).json({
            message: "Auth failed"
          });
        }
        bcrypt.compare(req.body.password, user[0].password, (err, result) => {
          if (err) {
            return res.status(401).json({
              message: "Auth failed"
            });
          }
          if (result) {
              const token = jwt.sign({
                  email: user[0].email,
                  userId: user[0]._id,                 
              }, 
              process.env.JWT_SECRET_KEY,
               {
                  expiresIn: '1h'
               },

              );
            return res.status(200).json({
              message: "Auth successful",
               token: token
            });
          }
          res.status(401).json({
            message: "Auth failed"
          });
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
  }

  exports.registerUser = (req,res, next)=>{
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
    
}

exports.deleteUser = (req,res, next) =>{
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

    
}

exports.userOut = (req, res, next) => {
    User.find({ email: req.body.email })
      .exec()
      .then(user => {
        if (user.length < 1) {
          return res.status(401).json({
            message: "Auth failed"
          });
        }
        bcrypt.compare(req.body.password, user[0].password, (err, result) => {
          if (err) {
            return res.status(401).json({
              message: "Auth failed"
            });
          }
          if (result) {
              const token = jwt.sign({
                  email: user[0].email,
                  userId: user[0]._id,                 
              }, 
              process.env.JWT_SECRET_KEY,
               {
                  expiresIn: '1h'
               },

              );
            return res.status(200).json({
              message: "Auth successful",
               token: token
            });
          }
          res.status(401).json({
            message: "Auth failed"
          });
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
  }
