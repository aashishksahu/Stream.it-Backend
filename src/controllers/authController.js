/*
 * authController is a set of functions to perform user 
 * registration and authentiation (login).
 * It uses JWT to generate an authorization token
 * 
 * Password encryption will be added when I feel like it
*/

var jwt = require('jsonwebtoken');
var conn = require('../database/createConnection');

var authController = {
    register(req, res) {

        conn.query('insert INTO users (username, usertype, passkey, email, DOB) VALUES (?,?,?,?,?);', [req.body.username,
        req.body.usertype,
        req.body.passkey,
        req.body.email,
        req.body.DOB
        ], (error) => {
            if (error) {
                console.log(error)
                // Instead of handling every type of database error 
                // I'll just send the error code, it'll be easier to 
                // understand what went wrong
                // If the database error is undefined then it'll be
                // an unknown error response
                res.send({
                    "code": 400,
                    "failed": (error.code)?error.code:"unknown error occured"
                })
            } else {
                // successful registration generates a token
                var token = jwt.sign({ username: req.body.username, usertype: req.body.usertype }, process.env.SECRET_KEY);
                res.send({
                    "code": 200,
                    "message": "user registered sucessfully",
                    "auth": true,
                    "token": token
                });
            }
        })

    },

    login(req, res) {
        conn.query(`SELECT * FROM users where username='${req.body.username}'`, (error, results) => {
            if (error) {
                console.log(error)
                res.send({
                    "code": 400,
                    "failed": "error ocurred"
                })
            } else {
                if (results.length > 0) {
                    if (results[0].passkey === req.body.passkey) {
                        var token = jwt.sign({ username: req.body.username, usertype: req.body.usertype }, process.env.SECRET_KEY);
                        res.send({
                            "code": 200,
                            "message": "user login sucessful",
                            "auth": true,
                            "usertype": results[0].usertype,
                            "username": results[0].username,
                            "userid": results[0].id,
                            "token": token
                        });
                    } else {
                        res.send({
                            "code": 401,
                            "message": "user login failed"
                        });
                    }
                } else {
                    res.send({
                        "code": 401,
                        "message": "user does not exist"
                    });
                }
            }
        })
    }

}

module.exports = authController;
