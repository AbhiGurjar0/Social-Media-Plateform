const mongoose = require('mongoose');
// mongoose.connect(`mongodb://127.0.0.1:27017/social-media`)
//     .then(function () {
//         console.log("connected");
//     })
//     .catch(function (err) {
//         console.log(err);
//     })
 

mongoose.connect(process.env.MONGO_URI).
    then(() => {
        console.log("MongoDB Connected");
    })
    .catch(err => {
        console.log("MongoDB connection err");
        console.log(err.message);

    }) 
module.exports = mongoose.connection;