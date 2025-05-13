require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const index = require('./routes/user')
const db = require("./config/mongoose-connection");
const { registerUser, loginUser, logoutUser } = require('./controllers/controller')
const cookieParser = require("cookie-parser");
app.set("view engine", "ejs");
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());
app.use("/", index);
app.use("/register", registerUser);
app.use("/login", loginUser);
app.use("/logout", logoutUser);


app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});
