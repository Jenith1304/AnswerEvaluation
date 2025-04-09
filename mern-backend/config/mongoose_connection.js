const mongoose = require("mongoose")
const config = require("config")

mongoose.connect(`${config.get("MONGODB_URI")}`)
    .then(() => {
        console.log("Mongoose Connected");
    })
    .catch((err) => {
        console.log("Mongoose Error", err);
    })
module.exports = mongoose.connection;
