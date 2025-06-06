const express = require('express');
const router = express.Router();
const userModel = require("../models/user-model");
const postModel = require("../models/post-model");
const isLoggedIn = require("../middlewares/isLoggedIn");
const upload = require("../config/multer-config");
const likeModel = require("../models/like-model");
const commentModel = require("../models/comments-model")
const followerModel = require("../models/follow-model")

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


router.post("/post/postDetails/:postId", async (req, res) => {
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
            }

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
        profilePic: user.profilePic ? user.ProfilePic : "default.jpg",

    });


})

//see others profile

router.get("/user/:userId", async (req, res) => {
    try {
        const user = await userModel
            .findOne({ _id: req.params.userId })
            .populate("posts");

        if (!user) return res.status(404).send("User not found");
        res.render("main", { user, posts: user.posts });
    } catch (err) {
        console.error("Error fetching user or posts:", err);
        res.status(500).send("Server error");
    }
})

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
            return;
        }
        await followerModel.create({
            follower: req.user._id,
            following: userId,
            createdAt: Date.now(),
        });

        await userModel.findByIdAndUpdate(req.user._id, {
            $addToSet: { following: userId },
        });

        await userModel.findByIdAndUpdate(userId, {
            $addToSet: { follower: req.user._id },
        });

        res.json({ message: "Follow successful" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});




//login/signup page
router.get("/signin", (req, res) => {
    res.render("login");
})
router.get("/user/followers", (req, res) => {
    res.render("follower");
})
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
router.get("/", async (req, res) => {
    try {
        let posts = await postModel.find({})
            .populate("userId")
            .populate("comments");

        posts = posts.filter(post => post.userId); // remove posts with missing user
        res.render("home", { posts });
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

module.exports = router;