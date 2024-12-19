import mongoose from "mongoose";
import Post from "@/lib/models/post";
import User from "@/lib/models/user";
import Review from "@/lib/models/review";
import Song from "@/lib/models/song";
import Comment from "@/lib/models/comment";
import Channel from "@/lib/models/channel";
import Key from "@/lib/models/key";
import Message from "@/lib/models/message";
import Session from "@/lib/models/session";
import { v4 as uuid } from "uuid";
import { auth } from "@/lib/lucia";


export default async function seed() {
  console.log("Seeding Database...")
  try {
    await mongoose.connect("mongodb://localhost:27017/musicboxd");

    await User.deleteMany({});
    await Song.deleteMany({});
    await Channel.deleteMany({});
    await Comment.deleteMany({});
    await Review.deleteMany({});
    await Post.deleteMany({});
    await Message.deleteMany({});
    await Key.deleteMany({});
    await Session.deleteMany({});

    const users = [
      { // 0
        email: "lnappi@stevens.edu",
        username: "lnappi",
        password: "Password1234!"
      },
      { // 1
        email: "tzang68@stevens.edu",
        username: "tzang68",
        password: "Password1234!"
      },
      { // 2
        email: "smcgratt@stevens.edu",
        username: "smcgratt",
        password: "Password1234!"
      },
      { // 3
        email: "tforgue@stevens.edu",
        username: "tforgue",
        password: "Password1234!"
      },
      { // 4
        email: "adeshmu7@stevens.edu",
        username: "adeshmukh",
        password: "Password1234!"
      },
      { // 5
        email: "acrescen@stevens.edu",
        username: "annabelle.crescenzo",
        password: "Password1234!"
      },
      { // 6
        email: "agupta4@stevens.edu",
        username: "ayushi.gupta4",
        password: "Password1234!"
      },
      { // 7
        email: "mengebr1@stevens.edu",
        username: "mengebr1",
        password: "Password1234!"
      },
      { // 8
        email: "eear@stevens.edu",
        username: "ester.ear",
        password: "Password1234!"
      },
      { // 9
        email: "ebrooks@stevens.edu",
        username: "emma.brooks",
        password: "Password1234!"
      },
      { // 10
        email: "nlara@stevens.edu",
        username: "nadilllllll",
        password: "Password1234!"
      },
      { // 11
        email: "mkearney@stevens.edu",
        username: "mattk",
        password: "Password1234!"
      },
      { // 12
        email: "knieuwen@stevens.edu",
        username: "kipnieu",
        password: "Password1234!"
      },
      { // 13
        email: "mjacob@stevens.edu",
        username: "mjacob31",
        password: "Password1234!"
      },
    ]

    const createdUserList = []
    for (const user of users) {
      const newUser = await auth.createUser({
        key: {
          providerId: "email",
          providerUserId: user.email.toLowerCase(),
          password: user.password
        },
        attributes: {
          email: user.email,
          username: user.username,
        },
      })
      createdUserList.push(newUser)
    }

    
    // POST 1
    let newPost = await Post.create({
      _id: uuid(),
      user_id: createdUserList[11].userId,
      title: "Latest Thoughts On The Music Industry",
      text: "I feel like with AI getting so popular it could have a real impact on the music industry. How should original artsits be credited? What are your guys thoughts?",
      likes: [createdUserList[0].userId, createdUserList[2].userId, createdUserList[4].userId, createdUserList[6].userId, createdUserList[8].userId, createdUserList[9].userId],
      dislikes: [createdUserList[4].userId],
      comments: [],
      created_at: new Date(),
      updated_at: "",
    });
    await newPost.save()

    let exists = await User.findById(newPost.user_id).exec();

    let updateInfo = await User.findByIdAndUpdate(newPost.user_id, {
      $push: {posts: newPost._id},
    }).exec();
    await updateInfo.save();

    let newComment = await Comment.create({
      _id: uuid(),
      post_id: newPost._id,
      user_id: createdUserList[0].userId,
      text: "AGREEED!!! DESTROYYYY AI",
      likes: [createdUserList[11].userId, createdUserList[2].userId],
      dislikes: [createdUserList[4].userId],
      created_at: new Date(),
      updated_at: "",
    });
    await newComment.save();

    updateInfo = await User.findByIdAndUpdate(newComment.user_id, {
      $push: { comments: newComment._id },
    }).exec();
    await updateInfo.save();

    await Post.findByIdAndUpdate(newComment.post_id, {
      $push: { comments: newComment._id },
    }).exec();
    await newPost.save();

    newComment = await Comment.create({
      _id: uuid(),
      post_id: newPost._id,
      user_id: createdUserList[4].userId,
      text: "nooo i love ai",
      likes: [createdUserList[4].userId, createdUserList[6].userId],
      dislikes: [createdUserList[11].userId],
      created_at: new Date(),
      updated_at: "",
    });
    await newComment.save();

    updateInfo = await User.findByIdAndUpdate(newComment.user_id, {
      $push: { comments: newComment._id },
    }).exec();
    await updateInfo.save();

    await Post.findByIdAndUpdate(newComment.post_id, {
      $push: { comments: newComment._id },
    }).exec();
    await newPost.save();


    // POST 2
    newPost = await Post.create({
      _id: uuid(),
      user_id: createdUserList[0].userId,
      title: "Bumping To Billie",
      text: "Listening to my favorite track right now. Anyone else really into Billie Eilish rn?",
      likes: [createdUserList[0].userId, createdUserList[1].userId, createdUserList[2].userId, createdUserList[3].userId, createdUserList[4].userId, createdUserList[5].userId, createdUserList[6].userId, createdUserList[7].userId, createdUserList[10].userId],
      dislikes: [],
      comments: [],
      created_at: new Date(),
      updated_at: "",
    });
    await newPost.save()

    exists = await User.findById(newPost.user_id).exec();

    updateInfo = await User.findByIdAndUpdate(newPost.user_id, {
      $push: {posts: newPost._id},
    }).exec();
    await updateInfo.save();

    newComment = await Comment.create({
      _id: uuid(),
      post_id: newPost._id,
      user_id: createdUserList[10].userId,
      text: "Billie b the goat",
      likes: [createdUserList[10].userId],
      dislikes: [],
      created_at: new Date(),
      updated_at: "",
    });
    await newComment.save();

    updateInfo = await User.findByIdAndUpdate(newComment.user_id, {
      $push: { comments: newComment._id },
    }).exec();
    await updateInfo.save();

    await Post.findByIdAndUpdate(newComment.post_id, {
      $push: { comments: newComment._id },
    }).exec();
    await newPost.save();

    // POST 3
    newPost = await Post.create({
      _id: uuid(),
      user_id: createdUserList[7].userId,
      title: "THE QUEEN HERSELF",
      text: "Just wanted to share my thoughts on something cool I discovered today. Queen Latifah is from New Jersey! That's why shes so cool.",
      likes: [createdUserList[3].userId, createdUserList[5].userId, createdUserList[7].userId, createdUserList[0].userId],
      dislikes: [],
      comments: [],
      created_at: new Date(),
      updated_at: "",
    });
    await newPost.save()

    exists = await User.findById(newPost.user_id).exec();


    updateInfo = await User.findByIdAndUpdate(newPost.user_id, {
      $push: {posts: newPost._id},
    }).exec();
    await updateInfo.save();

    newComment = await Comment.create({
      _id: uuid(),
      post_id: newPost._id,
      user_id: createdUserList[13].userId,
      text: "yusss queeeen",
      likes: [createdUserList[13].userId, createdUserList[7].userId],
      dislikes: [],
      created_at: new Date(),
      updated_at: "",
    });
    await newComment.save();

    updateInfo = await User.findByIdAndUpdate(newComment.user_id, {
      $push: { comments: newComment._id },
    }).exec();
    await updateInfo.save();

    await Post.findByIdAndUpdate(newComment.post_id, {
      $push: { comments: newComment._id },
    }).exec();
    await newPost.save();
  
    /**
    // ADD FRIENDS
    updateInfo = await User.findByIdAndUpdate(createdUserList[0].userId, {
      $push: { friends: createdUserList[1].userId },
    }).exec();
    await updateInfo.save();

    updateInfo = await User.findByIdAndUpdate(createdUserList[1].userId, {
      $push: { friends: createdUserList[2].userId },
    }).exec();
    await updateInfo.save();

    updateInfo = await User.findByIdAndUpdate(createdUserList[2].userId, {
      $push: { friends: createdUserList[3].userId },
    }).exec();
    await updateInfo.save();

    updateInfo = await User.findByIdAndUpdate(createdUserList[4].userId, {
      $push: { friends: createdUserList[5].userId },
    }).exec();
    await updateInfo.save();

    updateInfo = await User.findByIdAndUpdate(createdUserList[6].userId, {
      $push: { friends: createdUserList[7].userId },
    }).exec();
    await updateInfo.save();

    
    // FRIEND REQUESTS
    updateInfo = await User.findByIdAndUpdate(createdUserList[8].userId, {
      $push: { friend_requests: createdUserList[9].userId },
    }).exec();
    await updateInfo.save();

    updateInfo = await User.findByIdAndUpdate(createdUserList[10].userId, {
      $push: { friend_requests: createdUserList[11].userId },
    }).exec();
    await updateInfo.save();

    updateInfo = await User.findByIdAndUpdate(createdUserList[12].userId, {
      $push: { friend_requests: createdUserList[13].userId },
    }).exec();
    await updateInfo.save();
    */
    console.log("Done Seeding Database")
    await mongoose.disconnect();
  } catch (e) {
    console.log("Error:", e)
  }

  return

}
