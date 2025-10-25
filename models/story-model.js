// models/Story.js
const mongoose = require('mongoose');

const storySchema = new mongoose.Schema({ 
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    image: Buffer,
    video: Buffer,
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 86400, // Automatically deletes story after 24 hours
    },
    caption: {
        type: String,
        default: '',
    }
});

module.exports = mongoose.model('Story', storySchema);
