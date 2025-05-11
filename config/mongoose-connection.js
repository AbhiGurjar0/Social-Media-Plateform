const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI).
    then(() => {
        console.log("MongoDB Connected");
    })
    .catch(err => {
        console.log("MongoDB connection err");
        console.log(err.message);

    })
module.exports = mongoose.connection;