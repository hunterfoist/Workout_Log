let router = require("express").Router(); 
let User = require("../db").import("../models/user"); 
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

//User Registration
router.post('/register', function (req, res){

    User.create({
        username: req.body.user.username,
        passwordhash: bcrypt.hashSync(req.body.user.passwordhash, 13)
    })
    .then(
        function createSuccess(user) {
            let token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn: 60 * 60 * 24});
            res.json({
                user: user,
                message: 'User created successfully!',
                sessionToken: token
            });
        }
        
    )
.catch(err => res.status(500).json({ error: err}));
});

//User Sign In
router.post('/login', function (req, res){
    User.findOne({
        where: {
            username: req.body.user.username
        }
    })
    .then(
        function loginSuccess(user) {
            if (user) {
                bcrypt.compare(req.body.user.passwordhash, user.passwordhash, function (err, matches){
                    if (matches) {
                        let token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn: 60 * 60 * 24});
    
                        res.status(200).json({
                            user: user,
                            message: 'User logged in successfully!',
                            sessionToken: token
                })
                
            } else {
                res.status(502).json({error: 'Login failed'});
            }
        });
     } else {
            res.status(500).json({error: 'User does not exist.'})
        }
        }
    )
    .catch(err => res.status(500).json({ error: err}));
    });









module.exports = router;
