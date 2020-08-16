var conn = require('../database/createConnection');

var authController = {
    register(req, res) {

        conn.query('insert INTO users (username, usertype, passkey, email, DOB) VALUES (?,?,?,?,?);', [req.body.username,
        req.body.usertype,
        req.body.passkey,
        req.body.email,
        req.body.DOB
        ], (error, results) => {
            if (error) {
                console.log(error)
                res.send({
                    "code": 400,
                    "failed": "error ocurred"
                })
            } else {
                console.log(results);
                res.send({
                    "code": 200,
                    "success": "user registered sucessfully"
                });
            }
        })

    },

    login(req, res) {

        conn.query(`SELECT passkey FROM users where username='${req.body.username}'`, (error, results) => {
            if (error) {
                console.log(error)
                res.send({
                    "code": 400,
                    "failed": "error ocurred"
                })
            } else {
                if (results.length > 0) {

                    if (results[0].passkey === req.body.passkey) {
                        res.send({
                            "code": 200,
                            "success": "user login sucessful"
                        });
                    } else {
                        res.send({
                            "code": 401,
                            "success": "user login failed"
                        });
                    }
                } else {
                    res.send({
                        "code": 401,
                        "success": "user does not exist"
                    });
                }
            }
        })
    }

}

module.exports = authController;