const mongoose = require('mongoose');

mongoose.connect(`${process.env.MONGO_URI}/social-media`).
    then(() => {
        console.log("MongoDB Connected");
    })
    .catch(err => {
        console("MongoDB connection err");
        console.log(err.message);

    })
module.exports = mongoose.connection;