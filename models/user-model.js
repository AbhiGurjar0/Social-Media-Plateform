const mongoose = require('mongoose');
const userSchema = new mongoose.Schema(
    {
        profilePic: Buffer,
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

        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user",
        },
        posts: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Post',
                required: true,
            }
        ],
        like: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Like',

        }],
        comments: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment',

        }],
        followers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Follower',
            }
        ],
        following: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Follower',
            }
        ]
    }
);

module.exports = mongoose.model("User", userSchema);
