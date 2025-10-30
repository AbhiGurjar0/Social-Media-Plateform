const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const userModel = require("../models/user-model");
const postModel = require("../models/post-model");
const isLoggedIn = require("../middlewares/isLoggedIn");
const upload = require("../config/multer-config");
const likeModel = require("../models/like-model");
const commentModel = require("../models/comments-model");
const followerModel = require("../models/follow-model");
const saveModel = require("../models/saved-model");
const followModel = require("../models/follow-model");
const storyModel = require("../models/story-model");
const notificationModel = require("../models/notification-model");
const messageModel = require("../models/message-model");
const cloudinary = require("cloudinary").v2;
// const multer = require('multer')
// const storage = multer.memoryStorage();
// const upload = multer({ storage });

//profile page

//home page
router.get("/", isLoggedIn, async (req, res) => {
  try {
    let posts = await postModel
      .find()
      .populate({
        path: "userId",
        select: "userName profilePic",
      })
      .populate("comments")
      .populate({
        path: "like",
        populate: {
          path: "userId",
          model: "User",
        },
      });
    let stories = await storyModel.find().populate("user");

    let user = await userModel.findOne({ _id: req.user._id }).populate({
      path: "following",
      populate: { path: "following", model: "User" },
    });
    const following = await followerModel
      .find({ follower: user._id })
      .populate("following");

    // Get all the followed user IDs
    const followingIds = following.map((f) => f.following._id.toString());
    followingIds.push(req.user._id.toString());

    //saved reel
    const savedReels = await saveModel.find({ userId: req.user._id });

    // Filter stories to only those created by followed users
    stories = stories.filter((story) =>
      followingIds.includes(story.user._id.toString())
    );

    posts = posts.filter((post) => post.userId);
    // remove posts with missing user

    res.render("home", { user, posts, stories, savedReels, following });
  } catch (err) {
    console.error("Error:", err);
    if (!res.headersSent) {
      res.status(500).send("Something went wrong");
    }
  }
});

router.get("/explore", async (req, res) => {
  let posts = await postModel.find();
  res.render("explore", { posts });
});

//notification page
router.get("/notifications", isLoggedIn, async (req, res) => {
  let notifications = await notificationModel
    .find({ userId: req.user._id })
    .populate({
      path: "userId2",
      select: "userName profilePic",
    })
    .populate({
      path: "postId",
      select: "image video",
    });
  res.render("notification", { notifications });
});

//view story

router.get("/user/story/:storyId", async (req, res) => {
  let story = await storyModel
    .findOne({ _id: req.params.storyId })
    .populate("user");
  const storyExpiryDuration = 24 * 60 * 60 * 1000;
  const createdAt = new Date(story.createdAt);
  const currentTime = new Date();
  const timeElapsed = currentTime - createdAt;
  const timeLeft = storyExpiryDuration - timeElapsed;
  let hours = Math.floor(24 - timeLeft / 1000 / 60 / 60);
  if (hours == 0) {
    hours = Math.floor((24 - timeLeft / 1000 / 60 / 60) * 60) + "m";
  } else {
    hours += "h";
  }

  res.render("viewStory", { story, hours });
});
router.get("/main", isLoggedIn, async (req, res) => {
  try {
    const user = await userModel
      .findOne({ email: req.user.email })
      .populate("posts following");

    if (!user) return res.status(404).send("User not found");
    const savedReels = await saveModel.find({ userId: req.user._id });

    const savedPostIds = savedReels.map((r) => r.postId);

    // Fetch all posts (even by others) whose IDs are saved by the user
    const savedPosts = await postModel
      .find({ _id: { $in: savedPostIds } })
      .populate("userId");
    const loggedInUser = user;

    res.render("main", {
      user,
      posts: user.posts,
      savedReels,
      savedPosts,
      loggedInUser,
      isFollowed: null,
    });
  } catch (err) {
    console.error("Error fetching user or posts:", err);
    res.status(500).send("Server error");
  }
});
router.get("/postDetails/:postId", isLoggedIn, async (req, res) => {
  let post = await postModel.findOne({ _id: req.params.postId });
  let user = await userModel.findOne({ _id: req.user._id });
  res.render("postDetails", { post, user });
});

//post creation
router.post(
  "/createPost",
  upload.single("media"),
  isLoggedIn,
  async (req, res) => {
    try {
      console.log(req.body);
      const file = req.file;
      let {
        caption,
        tags,
        location,
        visibility,
        hideLikeViewCounts,
        disableComments,
      } = req.body;
      // console.log(req.file);
      const base64File = `data:${file.mimetype};base64,${file.buffer.toString(
        "base64"
      )}`;
      let result = await cloudinary.uploader.upload(base64File, {
        resource_type: "auto",
        overwrite: true,
      });
      console.log(result);

      let post = await postModel.create({
        userId: req.user._id,
        
        url: result.secure_url,
        type:result.resource_type,
        caption,
        tags,
        visibility,
        location,
        hideLikeViewCounts: hideLikeViewCounts === "on" ? true : false,
        disableComments: disableComments === "on" ? true : false,
        createdAt: Date.now(),
      });
      let user = await userModel.findOne({ email: req.user.email });
      user.posts.push(post._id);
      await user.save();

      res.redirect("/main");
    } catch (err) {
      console.log(err.message);
      return res.redirect("/main");
    }
  }
);

// upload story
router.post(
  "/uploadStory",
  upload.single("media"),
  isLoggedIn,
  async (req, res) => {
    try {
      const file = req.file;
      if (!file) return res.redirect("/");

      let story = await storyModel.create({
        user: req.user._id,
        image: file?.mimetype.startsWith("image/") ? file.buffer : "",
        video: file?.mimetype.startsWith("video/") ? file.buffer : "",
        createdAt: Date.now(),
      });
      let user = await userModel.findOne({ email: req.user.email });
      user.story.push(story._id);
      await user.save();

      res.redirect("/");
    } catch (err) {
      console.log(err.message);
      return res.redirect("/");
    }
  }
);

//like post
router.post("/post/like/:postId", isLoggedIn, async (req, res) => {
  try {
    const post = await postModel.findOne({ _id: req.params.postId }).populate({
      path: "like",
      populate: {
        path: "userId",
        model: "User",
      },
    });
    const isLiked = post.like.some((like) => like.userId.equals(req.user._id));
    if (!isLiked) {
      const newLike = await likeModel.create({
        userId: req.user._id,
        postId: req.params.postId,
      });
      await notificationModel.create({
        userId: post.userId,
        userId2: req.user._id,
        postId: post._id,
        action: "like",
        createdAt: Date.now(),
      });
      await postModel.updateOne(
        { _id: req.params.postId },
        { $push: { like: newLike._id } }
      );
    } else {
      const removedLike = await likeModel.findOneAndDelete({
        userId: req.user._id,
        postId: post._id,
      });

      await postModel.updateOne(
        { _id: req.params.postId },
        { $pull: { like: removedLike._id } }
      );
    }

    // Fetch updated like count
    const updatedPost = await postModel
      .findById(req.params.postId)
      .populate("like");
    const totalLikes = updatedPost.like.length;

    return res.json({
      liked: !isLiked,
      likes: totalLikes,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Something went wrong" });
  }
});

//open Like
router.post("/post/like/users/:postId", isLoggedIn, async (req, res) => {
  try {
    const likes = await likeModel
      .find({ postId: req.params.postId })
      .populate("userId", "userName profilePic");

    const userDetails = likes.map((like) => ({
      userName: like.userId.userName,
      userProfile: like.userId.profilePic || "default.jpg",
    }));

    res.send({ userDetails });
  } catch (err) {
    res.status(500).send({ error: "Server error", details: err.message });
  }
});

router.post("/post/postDetails/:postId", isLoggedIn, async (req, res) => {
  let post = await postModel
    .findById(req.params.postId)
    .populate({
      path: "comments",
      populate: {
        path: "userId",
        select: "userName profilePic",
      },
    })
    .populate({
      path: "userId",
      select: "userName profilePic",
    });
  const loggedInUser = await userModel.findById(req.user._id);

  // Check if logged-in user is the post owner
  const isOwner = String(post.userId._id) === String(loggedInUser._id);

  // Check if logged-in user follows the post owner
  const isFollowing = await followModel.findOne({
    follower: loggedInUser._id,
    following: post.userId._id,
  });

  const likes = await likeModel.find({ postId: req.params.postId });
  const isLiked = likes.some((like) => like.userId.equals(req.user._id));
  const isSaved = await saveModel.findOne({
    userId: req.user._id,
    postId: req.params.postId,
  });
  const commentDetails = post.comments.map((comment) => ({
    userName: comment.userId.userName,
    userProfile: comment.userId.profilePic?.toString("base64"),
    content: comment.content,
  }));

  res.json({
    video: post.video ? post.video.toString("base64") : "",
    image: post.image ? post.image.toString("base64") : "",
    comments: commentDetails,
    likeCount: likes.length,
    createdBy: post.userId
      ? {
          userId: post.userId._id,
          userName: post.userId.userName,
          userProfile: post.userId.profilePic?.toString("base64"),
        }
      : {
          userId: null,
          userName: "Unknown",
          userProfile: null,
        },
    isOwner: isOwner,
    isFollowing: !!isFollowing,
    isLiked: isLiked,
    isSaved: isSaved,
    disableComments: post.disableComments,
    hideLikeViewCounts: post.hideLikeViewCounts,
  });
});

//Add comment

router.post("/post/addComment", isLoggedIn, async (req, res) => {
  let { postId, comment } = req.body;
  let createdComment = await commentModel.create({
    userId: req.user._id,
    postId,
    content: comment,
  });
  let user = await userModel.findOne({ _id: req.user._id });
  // Fetch the post to get the original owner's userId
  const post = await postModel.findById(postId);

  await notificationModel.create({
    userId: post.userId, // post owner
    userId2: req.user._id,
    postId: createdComment.postId,
    action: "comment",
    createdAt: Date.now(),
  });
  await postModel.updateOne(
    { _id: postId },
    { $push: { comments: createdComment._id } }
  );
  await userModel.updateOne(
    { _id: req.user._id },
    { $push: { comments: createdComment._id } }
  );
  res.json({
    userName: user.userName,
    profilePic: user.profilePic ? user.profilePic : "default.jpg",
  });
});

//see others profile

router.get("/user/:userId", isLoggedIn, async (req, res, next) => {
  try {
    const { userId } = req.params;

    // Validate if userId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      next();
      return;
    }

    const user = await userModel.findOne({ _id: userId }).populate("posts");
    const loggedInUser = await userModel
      .findById(req.user._id)
      .populate("following");
    const savedReels = await saveModel.find({ userId: req.user._id });

    const savedPostIds = savedReels.map((r) => r.postId);

    const isFollowed = await followModel.findOne({ following: userId });

    // Fetch all posts (even by others) whose IDs are saved by the user
    const savedPosts = await postModel
      .find({ _id: { $in: savedPostIds } })
      .populate("userId");

    if (!user) return res.status(404).send("User not found");

    res.render("main", {
      user,
      posts: user.posts,
      loggedInUser,
      savedPosts,
      isFollowed,
    });
  } catch (err) {
    console.error("Error fetching user or posts:", err);
    res.status(500).send("Server error");
  }
});
//delete post

router.post("/post/delete", isLoggedIn, async (req, res) => {
  let { postId } = req.body;
  let post = await postModel.findOneAndDelete({ _id: postId });
  res.json("post Successfulyy Deleted");
});

//render edit
router.get("/post/edit/:Id", async (req, res) => {
  const post = await postModel.findById(req.params.Id);
  res.render("editPost", { post });
});

//edit post
router.post("/post/edit", isLoggedIn, async (req, res) => {
  let { postId, postData } = req.body;
  let post = await postModel.findOneAndUpdate(
    { _id: postId },
    {
      caption: postData.caption,
      tags: postData.tags,
      location: postData.location,
      hideLikeViewCounts: postData.hideLikes,
      disableComments: postData.disableComments,
    },
    {
      new: true,
    }
  );
  res.json("post Edited  Successfulyy");
});

//save post
router.post("/reel/save/:postId", isLoggedIn, async (req, res) => {
  const userId = req.user._id;
  const postId = req.params.postId;

  try {
    const existing = await saveModel.findOne({ userId, postId });

    if (existing) {
      // If already saved → unsave it
      await saveModel.deleteOne({ _id: existing._id });
      return res.json({ status: "unsaved" });
    } else {
      // Not saved yet → save it
      await saveModel.create({ userId, postId });
      return res.json({ status: "saved" });
    }
  } catch (err) {
    console.error("Save reel error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

//upload profile picture
router.post(
  "/uploadPic",
  upload.single("media"),
  isLoggedIn,
  async (req, res) => {
    try {
      await userModel.findOneAndUpdate(
        { _id: req.user._id },
        { profilePic: req.file.buffer }
      );

      res.redirect("/main");
    } catch (err) {
      console.error("Error uploading profile picture:", err);
      res.status(500).send("Internal Server Error");
    }
  }
);

//Followers

router.post("/user/addFollower", isLoggedIn, async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    let { userId } = req.body;
    if (req.user._id.equals(userId)) {
      return res.status(400).json({ message: "You can't follow yourself." });
    }
    console.log(userId);

    // Check if already following
    const existingFollow = await followerModel.findOne({
      follower: req.user._id,
      following: userId,
    });

    if (existingFollow) {
      // Unfollow logic
      await followerModel.deleteOne(
        {
          follower: req.user._id,
          following: userId,
        },
        { session }
      );

      await userModel.findByIdAndUpdate(
        req.user._id,
        {
          $pull: { following: userId },
        },
        { session }
      );

      await userModel.findByIdAndUpdate(
        userId,
        {
          $pull: { followers: req.user._id },
        },
        { session }
      );
      await session.commitTransaction();
      return res.json({ success: false, message: "Unfollowed successfully" });
    } else {
      // Follow logic
      await followerModel.create(
        [
          {
            follower: req.user._id,
            following: userId,
            createdAt: Date.now(),
          },
        ],
        { session }
      );
      await notificationModel.create(
        [
          {
            userId: userId,
            userId2: req.user._id,
            action: "follow",
            createdAt: Date.now(),
          },
        ],
        { session }
      );
      await userModel.findByIdAndUpdate(
        req.user._id,
        {
          $addToSet: { following: userId },
        },
        { session }
      );

      await userModel.findByIdAndUpdate(
        userId,
        {
          $addToSet: { followers: req.user._id },
        },
        { session }
      );
      await session.commitTransaction();
      return res.json({ success: true, message: "Followed successfully" });
    }
  } catch (error) {
    await session.abortTransaction();
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    session.endSession();
  }
});

//for checking user is owner or not delete post

router.post("/user/userdetails", isLoggedIn, async (req, res) => {
  try {
    let { userId } = req.body;

    let isOwner = String(userId) === String(req.user._id);
    res.json({ isOwner });
  } catch (err) {
    console.error("Error checking user ownership:", err);
    res.status(500).send("Internal Server Error");
  }
});

//login/signup page
router.get("/signin", (req, res) => {
  res.render("login");
});
router.get("/user/followers/:userId", async (req, res) => {
  try {
    const user = await userModel.findById(req.params.userId);
    if (!user) {
      return res.status(404).send("User not found");
    }
    const followers = await followerModel
      .find({ following: user._id })
      .populate("follower");
    const following = await followerModel
      .find({ follower: user._id })
      .populate("following");

    res.render("follower", {
      followers: followers,
      following: following,
      currentUser: user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

//edit profile page
router.get("/profile/edit", (req, res) => {
  res.render("editProfile");
});

router.get("/createPost", (req, res) => {
  res.render("createPost");
});

router.get("/editProfile", isLoggedIn, async (req, res) => {
  let user = await userModel.findOne({ _id: req.user._id });
  res.render("editProfile", { user });
});

//edit Profile

router.post("/user/editProfile", isLoggedIn, async (req, res) => {
  let { bio, fullName } = req.body;
  await userModel.findOneAndUpdate(
    { _id: req.user._id },
    {
      bio,
      fullName,
    },
    { new: true }
  );
  res.redirect("/main");
});
//postDetails

router.get("/postDetails", async (req, res) => {
  let { postId } = req.query;
  let post = await postModel
    .findById(postId)
    .populate({
      path: "comments",
      populate: {
        path: "userId",
        select: "userName fullName profilePic",
      },
    })
    .populate({
      path: "userId",
      select: "userName fullName profilePic",
    });
  res.render("postdetails", { post });
});

router.post("/post/likes", isLoggedIn, async (req, res) => {
  try {
    const postId = req.body.postId;
    const likes = await likeModel.find({ postId }).populate("userId");

    const likesWithBase64 = likes.map((like) => {
      const user = like.userId;
      return {
        ...like._doc,
        userId: {
          ...user._doc,
          profilePic: user.profilePic
            ? user.profilePic?.toString("base64") // ✅ Convert Buffer to base64 string
            : null,
        },
      };
    });

    res.json({ likes: likesWithBase64 });
  } catch (error) {
    console.error("Error fetching likes:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/chats", isLoggedIn, async (req, res) => {
  let users = await userModel.find({ _id: { $ne: req.user._id } });
  const loggedInUserId = req.user._id;
  res.render("chats", {
    users,
    loggedInUserId,
    messages: [],
    selectedUser: null,
  });
});
router.get("/chat/:userId", isLoggedIn, async (req, res) => {
  const loggedInUserId = req.user._id; // assuming session auth
  const selectedUserId = req.params.userId;

  let users = await userModel.find({ _id: { $ne: req.user._id } }); // all other users

  const messages = await messageModel
    .find({
      $or: [
        { sender: loggedInUserId, receiver: selectedUserId },
        { sender: selectedUserId, receiver: loggedInUserId },
      ],
    })
    .sort({ timestamp: 1 })
    .populate("sender");

  const selectedUser = await userModel.findById(selectedUserId);

  res.render("chats", {
    users,
    messages,
    selectedUser,
    loggedInUserId,
  });
});

router.get("/messages/unread-count", async (req, res) => {
  const { sender, receiver } = req.query;

  const count = await messageModel.countDocuments({
    sender,
    receiver,
    read: false,
  });

  res.json({ count });
});

const passport = require("passport");
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get("/search", (req, res) => {
  res.render("search");
});

router.post("/search", isLoggedIn, async (req, res) => {
  let { input } = req.body;

  let data;
  if (req.user && req.user._id) {
    data = await userModel.find({ _id: { $ne: req.user._id } }).populate({
      path: "following",
      select: "userId",
    });
  } else {
    data = await userModel.find().populate({
      path: "following",
      select: "userId",
    });
  }
  //   let user = await userModel.findById(req.user._id).populate(
  //     {
  //         path:'following',
  //         select:"userId"

  //     }
  //   )
  let users = data.map((user) => {
    if (user.userName.includes(input) || user.fullName.includes(input)) {
      return user;
    }
  });
  res.json({ success: true, data: users });
});
module.exports = router;
