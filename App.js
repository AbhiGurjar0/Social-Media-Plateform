require('dotenv').config();
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');
const index = require('./routes/user')
const db = require("./config/mongoose-connection");
const { registerUser, loginUser, logoutUser } = require('./controllers/controller')
const cookieParser = require("cookie-parser");
app.set("view engine", "ejs");
const crypto = require('crypto');
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());
const messageModel = require("./models/message-model");
app.use("/", index);
app.use("/register", registerUser);
app.use("/login", loginUser);
app.use("/logout", logoutUser);
function generateRoomId(userId1, userId2) {
    const raw = [userId1, userId2].sort().join("_");
    return crypto.createHash("sha256").update(raw).digest("hex");
}

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('joinRoom', ({
        userId, otherUserId
    }) => {
        const roomId = generateRoomId(userId, otherUserId);
        socket.join(roomId);
        console.log(`User ${userId} joined room: ${roomId}`);
    });


    socket.on('sendMessage', async (data) => {
        // Save to DB
        await messageModel.create({
            sender: data.senderId,
            receiver: data.receiverId,
            text: data.message
        });

        // Emit to room
        socket.to(data.roomId).emit('receiveMessage', data.message);
    });


    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});



http.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});
