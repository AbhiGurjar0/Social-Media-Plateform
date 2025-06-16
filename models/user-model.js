const mongoose = require('mongoose');
const userSchema = new mongoose.Schema(
    {
        profilePic: Buffer,
        userName: {
            type: String,
            required: true,
            maxlength: 10,
            unique: true,
            validate: {
                validator: function (v) {
                    return /^[a-zA-Z_]+[\d]*$/.test(v);
                },
                message: props => `${props.value} is not a valid user name! Only letters and underscores are allowed.`
            }
        }, 
        fullName: {
            type: String,
            required: true,
            maxlength: 10,
        },
        bio: String,
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
                ref: 'Follow',
            }
        ],
        following: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Follow',
            }
        ],
        story: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Story',
            }
        ]
    }
);

module.exports = mongoose.model("User", userSchema);
