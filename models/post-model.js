const mongoose = require('mongoose');
const postSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' ,required:true,},
        image: Buffer,
        video: Buffer,
        advancedSetting: String,
        caption: String,
        tags: String,
        location: String,
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


    }
);

module.exports = mongoose.model("Post", postSchema);
