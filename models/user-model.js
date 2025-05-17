const mongoose = require('mongoose');
const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
            maxlength: 10,
        },
        lastName: {
            type: String,
            required: true,
            maxlength: 10,
        },
        email: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 8,
        },
        contact: Number,
        picture: String,
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user",
        },
        posts: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Post'
            }
        ]
        ,
    }
);

module.exports = mongoose.model("User", userSchema);
