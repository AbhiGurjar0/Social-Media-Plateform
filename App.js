require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const index = require('./routes/user')
const db = require("./config/mongoose-connection");
const { registerUser, loginUser, logoutUser } = require('./controllers/controller')
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use("/", index);
app.use("/register", registerUser);
app.use("/login", loginUser);
app.use("/logout", logoutUser);


app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});
