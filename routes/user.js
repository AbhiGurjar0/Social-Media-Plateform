const express = require('express');
const router = express.Router();
const userModel = require("../models/user-model");
const postModel = require("../models/post-model");
const isLoggedIn = require("../middlewares/isLoggedIn");
const upload = require("../config/multer-config");

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
router.get("/postDetails/:postId",isLoggedIn, async (req, res) => {
    let post = await postModel.findOne({ _id: req.params.postId });
    let user = await userModel.findOne({_id:req.user._id});
    res.render("postDetails", { post ,user});
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
//login/signup page
router.get("/signin", (req, res) => {
    res.render("login");
})
//edit profile page
router.get("/profile/edit", (req, res) => {
    res.render("editProfile");
})

//home page
router.get("/", (req, res) => {
    res.render("home");
})

router.get("/explore", async (req, res) => {
    let posts = await postModel.find();
    res.render("explore", { posts });
})


module.exports = router;