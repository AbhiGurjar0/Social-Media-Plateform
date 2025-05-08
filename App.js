const express = require('express');
const app = express();
const path = require('path');
const index = require('./routes/user')
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/", index);

app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});
