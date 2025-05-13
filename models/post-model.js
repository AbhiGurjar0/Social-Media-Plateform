const mongoose = require('mongoose');
const postSchema = new mongoose.Schema(
    {
        userId:{type:mongoose.Schema.Types.ObjectId, ref:'User'},
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
       
    }
);

module.exports = mongoose.model("Post", postSchema);
