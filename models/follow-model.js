const mongoose = require("mongoose");

const followSchema = new mongoose.Schema({
    follower: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // who follows
    following: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // who is being followed
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Follow", followSchema);
