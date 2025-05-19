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

        // console.log("User with populated posts:", user);
        
        // user.posts.forEach((post)=>{
        //     console.log(post);
            
        // })
        res.render("main", { user, posts: user.posts });
    } catch (err) {
        console.error("Error fetching user or posts:", err);
        res.status(500).send("Server error");
    }
});
router.get("/postDetails/:postId", async (req,res)=>{
    let post = await postModel.findOne({_id:req.params.postId});
    res.render("postDetails",{post});
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
router.get("/followers", (req, res) => {
    res.render("follower");
})
//edit profile page
router.get("/profile/edit", (req, res) => {
    res.render("editProfile");
})

//home page
router.get("/", (req, res) => {
    res.render("home");
})

//notification page
router.get("/notifications", (req, res) => {
    res.render("notification");
})

module.exports = router;