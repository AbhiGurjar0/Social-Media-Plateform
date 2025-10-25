const mongoose = require('mongoose');
const notificationSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        userId2: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', default: null },
        action: {
            type: String,
            enum: ['like', 'comment', 'follow', 'mention'],
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        },


    }
);

module.exports = mongoose.model("Notification", notificationSchema);
