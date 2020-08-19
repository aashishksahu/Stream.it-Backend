var fs = require("fs");

var dataModel = {
    _img2base64(filePath){
        // converting album art stored in jpg to base64
        // to send in API payload
        
        var img = fs.readFileSync(filePath);
        return new Buffer(img).toString("base64");
    },

    createMetaPayload(results){

        var payload = [];

        for (let i in results){
            payload.push({
                id: results[i]["id"],
                title: results[i]["title"],
                artist: results[i]["artist"],
                likes: results[i]["likes"],
                dislikes: results[i]["dislikes"],
                label: results[i]["label"],
                albumart: this._img2base64(results[i]["albumart"])
            })
        }

        return payload;

    }

}

module.exports = dataModel;