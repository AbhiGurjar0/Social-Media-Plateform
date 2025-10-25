const mongoose = require('mongoose');

const savedReelSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post', // Assuming Reels are stored as posts
    required: true,
  },
  savedAt: {
    type: Date,
    default: Date.now,
  }
});

// Prevent duplicate saves (one user can't save the same reel twice)
savedReelSchema.index({ userId: 1, postId: 1 }, { unique: true });

module.exports = mongoose.model('SavedReel', savedReelSchema);
