const express = require('express');
const router = express.Router();
const userModel = require("../models/user-model");

//home page
router.get("/profile", async (req, res) => {
    let user = await userModel.findOne({ email: "bishwalpw123456789@gmail.com" });
    res.render("profile", { user });
})

//login/signup page

router.get("/signin", (req, res) => {
    res.render("login");
})

// post creation page 
router.get("/createPost", (req, res) => {
    res.render("createPost");
})

//edit profile page
router.get("/profile/edit", (req, res) => {
    res.render("editProfile");
})

//home page
router.get("/", (req, res) => {
    res.render("home");
})


module.exports = router;