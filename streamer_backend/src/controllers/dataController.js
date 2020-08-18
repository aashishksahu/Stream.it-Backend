var jwt = require('jsonwebtoken');
var conn = require('../database/createConnection');
var dataModel = require("../Model/dataModel");

var dataController = {
    topCharts(req, res) {

        try {
            var isVerified = jwt.verify(req.headers.authorization, process.env.SECRET_KEY);

            if (isVerified != undefined) {

                conn.query("SELECT id, title, artist, likes, label, albumart FROM audioserver ORDER BY likes DESC;", (error, results) => {
                    if (error) {
                        res.send({
                            code: 400,
                            "message": `Error Occured: ${error.code}`
                        })
                    } else {

                        res.send({
                            code: 200,
                            "resultSet": dataModel.topChartsPayload(results)
                        })

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