const express = require('express')
const bcrypt = require('bcrypt');
const cookie = require('cookie-parser');
const userModel = require('../models/user-model')
const { generateToken } = require('../utils/generateToken');

//Register 

module.exports.registerUser = async (req, res) => {
    try {
        let { firstName, lastName, email, password } = req.body;
        let isExist = await userModel.findOne({ email: email.toLowerCase() });
        if (isExist) {
            return res.send("user Already Exist");
        }
        let salt = await bcrypt.genSalt(10);
        let hashedPassword = await bcrypt.hash(password, salt);
        await userModel.create({
            firstName,
            lastName,
            email: email.toLowerCase(),
            password: hashedPassword,
        });
        res.redirect("/signin");
    } catch (err) {
        console.log(err, err.message);
        return res.send("error when register");
    };
}
//Login
module.exports.loginUser = async (req, res) => {
    try {
        let { email, password } = req.body;
        let user = await userModel.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.send("user does not Exist");
        }
        let result = await bcrypt.compare(password, user.password);
        if (result) {
            let token = generateToken(user);
            // console.log(token)
            res.cookie("token", token);
            return res.redirect("/");
        }
        return res.send("wrong email or password");

    } catch (err) {
        console.log(err, err.message);
        return res.send("error when login");
    };
}

//Logout
module.exports.logoutUser = async (req, res) => {
    res.cookie("token", "");
    return res.redirect("/signin");
}