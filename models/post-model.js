const mongoose = require('mongoose');
const postSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, },
        image: Buffer,
        video: Buffer,
        caption: String,
        tags: String,
        location: String,
        hideLikeViewCounts: {
            type: Boolean,
            default: false,
        },
        disableComments: {
            type: Boolean,
            default: false,
        },
        visibility: {
            type: String,
            default: 'private',

        },

        like: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Like',
            default: []

        }],
        comments: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment',
        }],
        createdAt: {
            type: Date,
            default: Date.now,
        }


    }
);

module.exports = mongoose.model("Post", postSchema);
