const multer = require('multer');
const path = require('path');

// Set memory storage engine
const storage = multer.memoryStorage();

// Multer upload instance
const upload = multer({
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024 } // 50 MB

});
module.exports = upload;