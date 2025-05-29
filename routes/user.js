const express = require('express');
const router = express.Router();
const userModel = require("../models/user-model");
const postModel = require("../models/post-model");
const isLoggedIn = require("../middlewares/isLoggedIn");
const upload = require("../config/multer-config");
const likeModel = require("../models/like-model");
const commentModel = require("../models/comments-model")

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
            await likeModel.findOneAndDelete({
                userId: req.user._id,
                postId: post._id
            });

            await postModel.updateOne(
                { _id: req.params.postId },
                { $pull: { like: { userId: req.user._id } } }
            );

            return res.json("unliked");
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Something went wrong" });
    }
});

//open Like
// router.post("/post/like/users/:postId", async (req, res) => {
//     try {
//         const likes = await likeModel
//             .find({ postId: req.params.postId })
//             .populate("userId", "firstName profilePic");

//         const userDetails = likes.map(like => ({
//             userName: like.userId.firstName,
//             userProfile: like.userId.profilePic || "default.jpg"
//         }));

//         res.send({ userDetails });
//     } catch (err) {
//         res.status(500).send({ error: "Server error", details: err.message });
//     }
// });


// router.post("/post/postDetails/:postId", async (req, res) => {
//     let post = await postModel.findById(req.params.postId)
//         .populate({
//             path: "comments",
//             populate: {
//                 path: "userId",
//                 select: "firstName profilePic"
//             }
//         })
//         .populate({
//             path: "userId",
//             select: "firstName profilePic"
//         });
//     const likes = await likeModel
//         .find({ postId: req.params.postId });

//     const commentDetails = post.comments.map((comment) => ({
//         userName: comment.userId.firstName,
//         userProfile: comment.userId.profilePic,
//         content: comment.content
//     }));

//     res.json({
//         video: post.video ? post.video.toString('base64') : '',
//         image: post.image ? post.image.toString('base64') : '',
//         comments: commentDetails,
//         likeCount: likes.length,
//         createdBy: post.userId
//             ? {
//                 userId: post.userId._id,
//                 userName: post.userId.firstName,
//                 userProfile: post.userId.profilePic
//             }
//             : {
//                 userId: null,
//                 userName: "Unknown",
//                 userProfile: null
//             }

//     });

// })
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


//home page
router.get("/", async (req, res) => {
    let posts = await postModel.find();
    res.render("home", { posts });
})

router.get("/explore", async (req, res) => {
    let posts = await postModel.find();
    res.render("explore", { posts });
})

//notification page
router.get("/notifications", (req, res) => {
    res.render("notification");
})

module.exports = router;