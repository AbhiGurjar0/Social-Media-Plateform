const express = require('express');
const mongoose = require("mongoose");
const router = express.Router();
const userModel = require("../models/user-model");
const postModel = require("../models/post-model");
const isLoggedIn = require("../middlewares/isLoggedIn");
const upload = require("../config/multer-config");
const likeModel = require("../models/like-model");
const commentModel = require("../models/comments-model")
const followerModel = require("../models/follow-model")

const followModel = require('../models/follow-model');
const storyModel = require("../models/story-model")

//profile page
router.get("/main", isLoggedIn, async (req, res) => {
    try {
        const user = await userModel
            .findOne({ email: req.user.email })
            .populate("posts");

        if (!user) return res.status(404).send("User not found");
        res.render("main", { user, posts: user.posts });
    } catch (err) {
        console.error("Error fetching user or posts:", err);
        res.status(500).send("Server error");
    }
});
router.get("/postDetails/:postId", isLoggedIn, async (req, res) => {
    let post = await postModel.findOne({ _id: req.params.postId });
    let user = await userModel.findOne({ _id: req.user._id });
    res.render("postDetails", { post, user });
})


//post creation 
router.post("/createPost", upload.single('media'), isLoggedIn, async (req, res) => {
    try {
        const file = req.file;
        let { caption, tags, location, visibility, advancedSetting } = req.body;
        // console.log(req.file);

        let post = await postModel.create({
            userId: req.user._id,
            image: file?.mimetype.startsWith("image/") ? file.buffer : undefined,
            video: file?.mimetype.startsWith("video/") ? file.buffer : undefined,
            caption,
            tags,
            visibility,
            location,
            advancedSetting,
            createdAt: Date.now(),

        })
        let user = await userModel.findOne({ email: req.user.email });
        user.posts.push(post._id);
        await user.save();

        res.redirect("/main");
    }
    catch (err) {
        console.log(err.message);
        return res.redirect("/main");
    }


});

// upload story 
router.post("/uploadStory", upload.single('media'), isLoggedIn, async (req, res) => {
    try {
        const file = req.file;
        if (!file) return res.redirect("/");

        let story = await storyModel.create({
            user: req.user._id,
            image: file?.mimetype.startsWith("image/") ? file.buffer : "",
            video: file?.mimetype.startsWith("video/") ? file.buffer : "",
            createdAt: Date.now(),
        })
        let user = await userModel.findOne({ email: req.user.email });
        user.story.push(story._id);
        await user.save();

        res.redirect("/");
    }
    catch (err) {
        console.log(err.message);
        return res.redirect("/");
    }


})

//like post
router.post("/post/like/:postId", isLoggedIn, async (req, res) => {
    try {
        let post = await postModel
            .findOne({ _id: req.params.postId })
            .select("like userId")
            .populate("like");

        let isLiked = post.like.some((like) => like.userId.equals(req.user._id));
        if (!isLiked) {
            let liked = await likeModel.create({
                userId: req.user._id,
                postId: req.params.postId
            });

            await postModel.updateOne(
                { _id: req.params.postId },
                { $push: { like: liked._id } }
            );

            return res.json("liked");
        } else {
            let liked = await likeModel.findOneAndDelete({
                userId: req.user._id,
                postId: post._id
            });

            await postModel.updateOne(
                { _id: req.params.postId },
                { $pull: { like: liked._id } }
            );

            return res.json("unliked");
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Something went wrong" });
    }
});

//open Like
router.post("/post/like/users/:postId", async (req, res) => {
    try {
        const likes = await likeModel
            .find({ postId: req.params.postId })
            .populate("userId", "firstName profilePic");

        const userDetails = likes.map(like => ({
            userName: like.userId.firstName,
            userProfile: like.userId.profilePic || "default.jpg"
        }));

        res.send({ userDetails });
    } catch (err) {
        res.status(500).send({ error: "Server error", details: err.message });
    }
});


router.post("/post/postDetails/:postId", isLoggedIn, async (req, res) => {
    let post = await postModel.findById(req.params.postId)
        .populate({
            path: "comments",
            populate: {
                path: "userId",
                select: "firstName profilePic"
            }
        })
        .populate({
            path: "userId",
            select: "firstName profilePic"
        });
    const loggedInUser = await userModel.findById(req.user._id);

    // Check if logged-in user is the post owner
    const isOwner = String(post.userId._id) === String(loggedInUser._id);

    // Check if logged-in user follows the post owner
    const isFollowing = await followModel.findOne({
        follower: loggedInUser._id,
        following: post.userId._id
    });

    const likes = await likeModel
        .find({ postId: req.params.postId });

    const commentDetails = post.comments.map((comment) => ({
        userName: comment.userId.firstName,
        userProfile: comment.userId.profilePic,
        content: comment.content
    }));

    res.json({
        video: post.video ? post.video.toString('base64') : '',
        image: post.image ? post.image.toString('base64') : '',
        comments: commentDetails,
        likeCount: likes.length,
        createdBy: post.userId
            ? {
                userId: post.userId._id,
                userName: post.userId.firstName,
                userProfile: post.userId.profilePic
            }
            : {
                userId: null,
                userName: "Unknown",
                userProfile: null
            },
        isOwner: isOwner,
        isFollowing: !!isFollowing,
    });

})

//Add comment 

router.post("/post/addComment", isLoggedIn, async (req, res) => {

    let { postId, comment } = req.body;
    let createdComment = await commentModel.create({
        userId: req.user._id,
        postId,
        content: comment,
    });
    let user = await userModel.findOne({ _id: req.user._id });
    await postModel.updateOne(
        { _id: postId },
        { $push: { comments: createdComment._id } },
    );
    await userModel.updateOne(
        { _id: req.user._id },
        { $push: { comments: createdComment._id } },
    );
    res.json({
        userName: user.firstName,
        profilePic: user.profilePic ? user.profilePic : "default.jpg",

    });


})

//see others profile

router.get("/user/:userId", isLoggedIn, async (req, res, next) => {
    try {
        const { userId } = req.params;

        // Validate if userId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(userId)) {

            next();
            return;
        }

        const user = await userModel.findOne({ _id: userId }).populate("posts");
        if (!user) return res.status(404).send("User not found");

        res.render("main", { user, posts: user.posts });
    } catch (err) {
        console.error("Error fetching user or posts:", err);
        res.status(500).send("Server error");
    }
});
//delete post

router.post("/post/delete", isLoggedIn, async (req, res) => {
    let { postId } = req.body;
    let post = await postModel.findOneAndDelete({ _id: postId });
    res.json("post Successfulyy Deleted");

})

//upload profile picture
router.post("/uploadPic", upload.single("media"), isLoggedIn, async (req, res) => {
    try {
        await userModel.findOneAndUpdate(
            { _id: req.user._id },
            { profilePic: req.file.buffer }
        );

        res.redirect("/main");
    } catch (err) {
        console.error("Error uploading profile picture:", err);
        res.status(500).send("Internal Server Error");
    }
});

//Followers

router.post("/user/addFollower", isLoggedIn, async (req, res) => {
    try {
        let { userId } = req.body;
        if (req.user._id.equals(userId)) {
            return res.status(400).json({ message: "You can't follow yourself." });
        }

        // Check if already following
        const existingFollow = await followerModel.findOne({
            follower: req.user._id,
            following: userId,
        });

        if (existingFollow) {
            // Unfollow logic
            await followerModel.deleteOne({
                follower: req.user._id,
                following: userId,
            });

            await userModel.findByIdAndUpdate(req.user._id, {
                $pull: { following: userId },
            });

            await userModel.findByIdAndUpdate(userId, {
                $pull: { followers: req.user._id },
            });

            return res.json({ message: "Unfollowed successfully" });
        } else {
            // Follow logic
            await followerModel.create({
                follower: req.user._id,
                following: userId,
                createdAt: Date.now(),
            });

            await userModel.findByIdAndUpdate(req.user._id, {
                $addToSet: { following: userId },
            });

            await userModel.findByIdAndUpdate(userId, {
                $addToSet: { followers: req.user._id },
            });

            return res.json({ message: "Followed successfully" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

//for checking user is owner or not delete post

router.post("/user/userdetails", isLoggedIn, async (req, res) => {
    try {
        let { userId } = req.body;


        let isOwner = String(userId) === String(req.user._id);
        res.json({ isOwner })


    } catch (err) {
        console.error("Error checking user ownership:", err);
        res.status(500).send("Internal Server Error");
    }
});






//login/signup page
router.get("/signin", (req, res) => {
    res.render("login");
})
router.get("/user/followers/:userId", async (req, res) => {
    try {
        const user = await userModel.findById(req.params.userId);
        if (!user) {
            return res.status(404).send("User not found");
        }
        const followers = await followerModel.find({ following: user._id }).populate('follower');
        const following = await followerModel.find({ follower: user._id }).populate('following');

        res.render("follower", {
            followers: followers,
            following: following,
            currentUser: user
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});



//edit profile page
router.get("/profile/edit", (req, res) => {
    res.render("editProfile");
})

router.get("/createPost", (req, res) => {
    res.render("createPost");
})

router.get("/editProfile", (req, res) => {
    res.render("editProfile");
})

//postDetails

router.get("/postDetails", async (req, res) => {
    let { postId } = req.query;
    let post = await postModel.findOne({ _id: postId }).populate("userId");
    res.render("postdetails", { post });
});

//home page
router.get("/", isLoggedIn, async (req, res) => {
    try {
        let posts = await postModel.find()
            .populate({
                path: "userId",
                select: "firstName profilePic"
            })
            .populate("comments");
        let stories = await storyModel.find().populate("user");
        let user = await userModel.findOne({ _id: req.user._id });
        const following = await followerModel.find({ follower: user._id }).populate('following');

        // Get all the followed user IDs
        const followingIds = user.following.map(f => f._id.toString());
        followingIds.push(req.user._id.toString());

        // Filter stories to only those created by followed users
        stories = stories.filter(story => followingIds.includes(story.user._id.toString()));


        posts = posts.filter(post => post.userId);
        // remove posts with missing user
        res.render("home", { posts, stories });
    } catch (err) {
        console.error("Error:", err);
        if (!res.headersSent) {
            res.status(500).send("Something went wrong");
        }
    }
});

router.get("/explore", async (req, res) => {
    let posts = await postModel.find();
    res.render("explore", { posts });
})

//notification page
router.get("/notifications", (req, res) => {
    res.render("notification");
})

//view story

router.get("/user/story/:storyId", async (req, res) => {
    let story = await storyModel.findOne({ _id: req.params.storyId }).populate("user");
    const storyExpiryDuration = 24 * 60 * 60 * 1000;
    const createdAt = new Date(story.createdAt);
    const currentTime = new Date();
    const timeElapsed = currentTime - createdAt;
    const timeLeft = storyExpiryDuration - timeElapsed;
    let hours = Math.floor(24 - (((timeLeft / 1000) / 60) / 60));

 
    res.render("viewStory", { story, hours });
})



module.exports = router;