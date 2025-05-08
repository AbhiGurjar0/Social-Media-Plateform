const express = require('express');
const router = express.Router();
router.get("/signin", (req, res) => {
   
})
router.get("/", (req, res) => { 
    res.send("login hai");
})

module.exports = router;