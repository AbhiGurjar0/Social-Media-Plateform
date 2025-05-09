const express = require('express');
const router = express.Router();
const userModel = require("../models/user-model");
router.get("/signin", (req, res) => {
    res.render("login");
})

router.get("/", async (req, res) => {
    let user = await userModel.findOne({ email: "abhi@mail" });
    res.render("home", { user });
})

module.exports = router;