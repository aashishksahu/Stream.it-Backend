var jwt = require('jsonwebtoken');
var conn = require('../database/createConnection');
var dataModel = require("../Model/dataModel");

/** Top Charts: Top 10 most liked songs **/
var topCharts = (req, res) => {

    /**
     * Songs with minimum (Likes - Dislikes) are on the top
     */

    try {
        var isVerified = jwt.verify(req.headers.authorization, process.env.SECRET_KEY);

        if (isVerified != undefined) {

            conn.query("SELECT id, title, artist, likes, dislikes, label, albumart FROM audioserver ORDER BY (likes-dislikes) DESC LIMIT 10;", (error, results) => {
                if (error) {
                    console.log("err: ", error.message)
                    res.send({
                        code: 400,
                        "message": `Error Occured: ${error.code}`
                    })
                } else {

                    res.send({
                        code: 200,
                        "resultSet": dataModel.createMetaPayload(results)
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
/* ---------- xxxx ---------- */


/** Favourites: User favourites **/
var getFavouriteID = async (req, res) => {
    // STEP 1: Get the Audio ID for a given User ID
    return new Promise((resolve, reject) => {
        conn.query(`SELECT audioid FROM favourites WHERE userid=${req.body["userid"]}`, (error, results) => {
            if (error) {
                console.log("err: ", error.message)
                res.send({
                    code: 400,
                    "message": `Error Occured: ${error.code}`
                })
                reject(false);
            } else {
                resolve(results);
            }

        })
    })


}

var getFavouriteList = async (resultSet) => {
    // STEP 2: Get the audio meta data for the requested Audio ID 
    return new Promise((resolve, reject) => {

        // convert resultSet object values to an array
        var ids = [];
        for (let i in resultSet) {
            ids.push(resultSet[i].audioid)
        }

        conn.query(`SELECT id, title, artist, likes, label, albumart FROM audioserver where id in (${ids})`, (error, results) => {
            if (error) {
                console.log("err: ", error.message)
                res.send({
                    code: 400,
                    "message": `Error Occured: ${error.code}`
                })
                reject(false);
            } else {
                resolve(results);
            }

        })
    })

}

var getFavourites = async (req, res) => {
    try {
        var isVerified = jwt.verify(req.headers.authorization, process.env.SECRET_KEY);
        if (isVerified != undefined) {

            var IDList = await getFavouriteID(req, res);
            var favList = await getFavouriteList(IDList);
            if (favList.length > 0 && favList != undefined) {
                res.send({
                    code: 200,
                    results: dataModel.createMetaPayload(favList)
                })
            }
        }

    } catch (error) {
        res.send({
            code: 401,
            "message": error.code
        })
    }
}

var addToFavourites = (req, res) => {
    try {
        var isVerified = jwt.verify(req.headers.authorization, process.env.SECRET_KEY);
        if (isVerified != undefined) {

            conn.query(`Insert into favourites(userid, audioid) VALUES (${req.body.userid}, ${req.body.audioid})`, (error, results) => {
                if (error) {
                    console.log("err: ", error.message)
                    res.send({
                        code: 400,
                        "message": error.code
                    })
                } else {
                    res.send({
                        code: 201,
                        "success": "Record created"
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
/* ---------- xxxx ---------- */


/** Likes: User Likes **/
var updateLikes = (req, res)=>{
    try {
        var isVerified = jwt.verify(req.headers.authorization, process.env.SECRET_KEY);
        if (isVerified != undefined) {

            conn.query(`UPDATE audioserver set likes=likes+1 where id=${req.body.audioid}`, (error, results) => {
                if (error) {
                    console.log("err: ", error.message)
                    res.send({
                        code: 400,
                        "message": error.code
                    })
                } else {
                    res.send({
                        code: 201,
                        "success": "Record Updated"
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

var updateDislikes = (req, res)=>{
    try {
        var isVerified = jwt.verify(req.headers.authorization, process.env.SECRET_KEY);
        if (isVerified != undefined) {

            conn.query(`UPDATE audioserver set dislikes=dislikes+1 where id=${req.body.audioid}`, (error, results) => {
                if (error) {
                    console.log("err: ", error.message)
                    res.send({
                        code: 400,
                        "message": error.code
                    })
                } else {
                    res.send({
                        code: 201,
                        "success": "Record Updated"
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
/* ---------- xxxx ---------- */


module.exports = { topCharts, getFavourites, addToFavourites, updateLikes, updateDislikes };