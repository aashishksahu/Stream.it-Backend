var jwt = require('jsonwebtoken');
var conn = require('../database/createConnection');

var dataController = {
    topCharts(req, res) {

        try {
            var isVerified = jwt.verify(req.headers.authorization, process.env.SECRET_KEY);

            if (isVerified != undefined) {

                conn.query("SELECT * FROM audioserver ORDER BY likes DESC;", (error, results) => {
                    if (error) {
                        res.send({
                            code: 400,
                            "message": `Error Occured: ${error.code}`
                        })
                    } else {

                        ///////////// TODO /////////////
                        // Create Payload for response with everything
                        // except the song file and send the album art 
                        // as image

                        // res.send({
                        //     code: 200,
                        //     "payload": results
                        // })

                    }
                })
            }

        } catch (error) {
            res.send({
                code: 401,
                "message": "Authorization Failure"
            })
        }

    }
}

module.exports = dataController;