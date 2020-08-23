var jwt = require('jsonwebtoken');
var conn = require('../database/createConnection');
var dataModel = require("../Model/dataModel");
var ms = require('mediaserver');

/** Top Charts: Top 10 most liked songs **/
var topCharts = (req, res) => {


    try {
        var isVerified = jwt.verify(req.headers.authorization, process.env.SECRET_KEY);

        if (isVerified != undefined) {

            conn.query("SELECT audioserver.*, COUNT(likes.userid) AS likes FROM audioserver INNER JOIN likes ON audioserver.id=likes.audioid GROUP BY likes.audioid ORDER BY likes DESC LIMIT 10;", (error, results) => {
                if (error) {
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

        conn.query(`SELECT * FROM audioserver where id in (${ids})`, (error, results) => {
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

var checkExistingEntry = async (req, res) => {
    return new Promise((resolve, reject) => {
        conn.query(`select audioid, userid from favourites where audioid=${req.body.audioid} and userid=${req.body.userid};`, (error, results) => {
            if (error) {
                reject(true);
                res.send({
                    code: 400,
                    "message": error.code
                })
            } else {
                resolve(results);

            }
        })
    })
}

var insertFavourites = async (req, res) => {
    return new Promise((resolve, reject) => {
        conn.query(`Insert into favourites(userid, audioid) VALUES (${req.body.userid}, ${req.body.audioid})`, (error, results) => {
            if (error) {
                reject(true);
                res.send({
                    code: 400,
                    "message": error
                })
            } else {
                resolve(results);
                res.send({
                    code: 201,
                    "success": "record created"
                })
            }
        })
    })
}

var addToFavourites = async (req, res) => {
    try {
        var isVerified = jwt.verify(req.headers.authorization, process.env.SECRET_KEY);
        if (isVerified != undefined) {

            // first check if user has already added song to favourites
            // If isDuplicate is an array of database rows then there
            // are already existing values for the given audioid and 
            // userid, i.e., the user has already added the song to 
            // favourites. In that case data will not be entered.
            var isDuplicate = await checkExistingEntry(req, res);
            if (isDuplicate.length < 1) {
                var added = await insertFavourites(req, res);
            } else {
                res.send({
                    code: 400,
                    "message": "duplicate entry"
                })
            }
        }

    } catch (error) {
        console.error(error)
        res.send({
            code: 401,
            "message": "Authorization Failure"
        })
    }
}

var removeFavourites = (req, res) => {
    try {
        var isVerified = jwt.verify(req.headers.authorization, process.env.SECRET_KEY);
        if (isVerified != undefined) {

            conn.query(`DELETE FROM favourites where favid=${req.body.favid}`, (error, results) => {
                if (error) {
                    console.log("err: ", error.message)
                    res.send({
                        code: 400,
                        "message": error.code
                    })
                } else {
                    res.send({
                        code: 201,
                        "success": "Record Deleted"
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
var checkLiked = async (req, res) => {
    return new Promise((resolve, reject) => {
        conn.query(`select * from likes where audioid=${req.body.audioid} and userid=${req.body.userid}`, (error, results) => {
            if (error) {
                reject(true);
                res.send({
                    code: 400,
                    "message": error.code
                })
            } else {
                resolve(results);
            }
        })
    })
}

var insertLike = async (req, res) => {
    return new Promise((resolve, reject) => {
        conn.query(`Insert into likes(userid, audioid) VALUES (${req.body.userid}, ${req.body.audioid})`, (error, results) => {
            if (error) {
                reject(true);
                res.send({
                    code: 400,
                    "message": error.code
                })
            } else {
                resolve(results);
                res.send({
                    code: 201,
                    "message": "record created"
                })

            }
        })
    })
}

var updateLikes = async (req, res) => {
    try {
        var isVerified = jwt.verify(req.headers.authorization, process.env.SECRET_KEY);
        if (isVerified != undefined) {

            var addLike;

            // First check if the user has already liked the song
            var existingLikes = await checkLiked(req, res);
            // if existingLikes is an array of length > 0
            // then there are already existing likes
            if (existingLikes.length < 1) {
                addLike = await insertLike(req, res);
            } else {
                res.send({
                    code: 401,
                    "message": "duplicate entry"
                })
            }
        }

    } catch (error) {
        res.send({
            code: 401,
            "message": "Authorization Failure"
        })
    }
}

var getLikeCountForSong = (req, res) => {
    try {
        var isVerified = jwt.verify(req.headers.authorization, process.env.SECRET_KEY);
        if (isVerified != undefined) {

            conn.query(`select count(userid) as likes from likes group by audioid having audioid=${req.body.audioid}`, (error, results) => {
                if (error) {
                    res.send({
                        code: 400,
                        "message": error.code
                    })
                } else {

                    res.send({
                        code: 200,
                        "resultSet": results
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


/** Streaming  **/
var getAudioPath = async (audioid) => {
    try {
        return new Promise((resolve, reject) => {
            conn.query(`SELECT audiofilepath FROM audioserver WHERE id=${audioid}`, (error, results) => {
                if (error) {
                    reject(false);
                } else {
                    resolve(results[0].audiofilepath);
                }
            })
        })
    } catch (error) {
        console.log(error);
    }

}

var streamAudio = async (req, res) => {

    try {
        var isVerified = jwt.verify(req.headers.authorization, process.env.SECRET_KEY);
        if (isVerified != undefined) {
            // Fetch the file path for the requested audio ID
            const audioPath = await getAudioPath(req.body.audioid);

            /**
             * It isn't about show off, it's productive to use 
             * a library that is properly tested instead of using
             * my own speghatti code
             * 
             * Also, I tried creating my own streaming module
             * by using readFileStream and send a stream of mp3
             * file in chunks but It just doesn't work, so, here
             * we are :( 
             * 
             * this is what I used
             * https://github.com/obastemur/mediaserver
             */

            ms.pipe(req, res, audioPath);


        }
    } catch (error) {
        console.log("[error]", error)
        res.send({
            code: 400,
            "message": (error.code == undefined) ? "Unknown Error" : error.code
        })
    }


}
/* ---------- xxxx ---------- */


/** Streaming  **/
var finder = (req, res) => {

    try {
        var isVerified = jwt.verify(req.headers.authorization, process.env.SECRET_KEY);
        if (isVerified != undefined) {

            var phrase = req.query.searchterm.toString().toLowerCase()

            conn.query(`SELECT * FROM audioserver WHERE title LIKE '%${phrase}%' OR artist LIKE '%${req.query.searchterm}%'`, (error, results) => {
                if (error) {
                    res.send({
                        code: 400,
                        "message": error.code
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
        console.log("[error]", error)
        res.send({
            code: 400,
            "message": (error.code == undefined) ? "Unknown Error" : error.code
        })
    }

}
/* ---------- xxxx ---------- */

/** Comments **/
var getCommentsForAudioID = (req, res) => {
    try {
        var isVerified = jwt.verify(req.headers.authorization, process.env.SECRET_KEY);
        if (isVerified != undefined) {

            conn.query(`SELECT * FROM comments WHERE audioid=${req.body.audioid}`, (error, results) => {
                if (error) {
                    res.send({
                        code: 400,
                        "message": error.code
                    })
                } else {

                    res.send({
                        code: 200,
                        "resultSet": results
                    })
                }
            })

        }
    } catch (error) {
        console.log("[error]", error)
        res.send({
            code: 400,
            "message": (error.code == undefined) ? "Unknown Error" : error.code
        })
    }
}

var addComment = (req, res) => {
    try {
        var isVerified = jwt.verify(req.headers.authorization, process.env.SECRET_KEY);
        if (isVerified != undefined) {

            conn.query(`INSERT INTO comments (userid, audioid, comment) VALUES(${req.body.userid}, ${req.body.audioid}, '${req.body.comment}')`, (error, results) => {
                if (error) {
                    console.log(error)
                    res.send({
                        code: 400,
                        "message": error.code
                    })
                } else {

                    res.send({
                        code: 201,
                        "message": "record added"
                    })
                }
            })

        }
    } catch (error) {
        console.log("[error]", error)
        res.send({
            code: 400,
            "message": (error.code == undefined) ? "Unknown Error" : error.code
        })
    }
}
/* ---------- xxxx ---------- */



module.exports = { topCharts, getFavourites, addToFavourites, removeFavourites, getLikeCountForSong, updateLikes, streamAudio, finder, getCommentsForAudioID, addComment };