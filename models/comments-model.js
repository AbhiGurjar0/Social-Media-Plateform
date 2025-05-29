const mongoose = require('mongoose');
const commentsSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
        content: String,
        Likes: [
            {type: mongoose.Schema.Types.ObjectId, ref: 'Like'}
        ],
    }
);

module.exports = mongoose.model("Comment", commentsSchema);
