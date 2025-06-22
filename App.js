require('dotenv').config();
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');
const passport = require('passport');
const index = require('./routes/user')
const db = require("./config/mongoose-connection");
const { registerUser, loginUser, logoutUser } = require('./controllers/controller')
const cookieParser = require("cookie-parser");
app.set("view engine", "ejs");
const crypto = require('crypto');
const session = require('express-session');
const messageModel = require("./models/message-model");
require('./config/passport');

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());
app.use("/", index);
app.use("/register", registerUser);
app.use("/login", loginUser);
app.use("/logout", logoutUser);

app.use(session({
    secret: 'your-session-secret',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', require('./routes/auth'));

function generateRoomId(userId1, userId2) {
    const raw = [userId1, userId2].sort().join("_");
    return crypto.createHash("sha256").update(raw).digest("hex");
}
io.on('connection', (socket) => {
    // console.log('User connected:', socket.id);

    socket.on('joinRoom', async ({ userId, otherUserId }) => {
        // Inside socket.on('joinRoom')
        await messageModel.updateMany(
            { sender: otherUserId, receiver: userId, read: false },
            { $set: { read: true } }
        );

        const roomId = generateRoomId(userId, otherUserId);
        socket.join(roomId);
        console.log(`User ${userId} joined room: ${roomId}`);
    });

    socket.on('sendMessage', async (data) => {
        const { senderId, receiverId, message, timestamp, roomId } = data;

        // Save to DB
        await messageModel.create({
            sender: senderId,
            receiver: receiverId,
            text: message,
            timestamp: timestamp,
            read: false
        });

        // Send to other user in room
        socket.to(roomId).emit('receiveMessage', {
            text: message,
            timestamp: timestamp
        });
    });

    socket.on('disconnect', () => {
        // console.log('User disconnected');
    });
});

// Utility to generate consistent room ID
function generateRoomId(user1, user2) {
    return [user1, user2].sort().join('_');
}




http.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});
