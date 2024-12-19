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
 import https from "https";

 const SPOTIFY_CLIENT_ID = process.env.CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.CLIENT_SECRET;

function getSpotifyAccessToken() {
  return new Promise((resolve, reject) => {
    const data = new URLSearchParams({
      grant_type: "client_credentials",
      client_id: SPOTIFY_CLIENT_ID,
      client_secret: SPOTIFY_CLIENT_SECRET,
    }).toString();

    const options = {
      hostname: "accounts.spotify.com",
      path: "/api/token",
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Content-Length": data.length,
      },
    };

    const req = https.request(options, (res) => {
      let body = "";
      res.on("data", (chunk) => {
        body += chunk;
      });

      res.on("end", () => {
        if (res.statusCode === 200) {
          resolve(JSON.parse(body).access_token);
        } else {
          reject(new Error(`Failed to get access token: ${res.statusCode}`));
        }
      });
    });

    req.on("error", reject);
    req.write(data);
    req.end();
  });
}

function getSpotifySongs(accessToken) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "api.spotify.com",
      path: "/v1/playlists/4cHO5iUskNinEMC3xl8I6Y",
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    const req = https.request(options, (res) => {
      let body = "";
      res.on("data", (chunk) => {
        body += chunk;
      });

      res.on("end", () => {
        if (res.statusCode === 200) {
          const data = JSON.parse(body);
          const songs = data.tracks.items.map((item) => {
            const track = item.track;
            return {
              spotify_id: track.id, // Spotify ID
              name: track.name, // Track name
              artist: track.artists.map((artist) => artist.name).join(", "), // Artists
              album: track.album.name, // Album name
            };
          });
          resolve(songs);
        } else {
          reject(new Error(`Failed to get songs: ${res.statusCode}`));
        }
      });
    });

    req.on("error", reject);
    req.end();
  });
}



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

    const accessToken = await getSpotifyAccessToken();
    const songs = await getSpotifySongs(accessToken);

    // Add songs to the database
    for (const song of songs) {
      await Song.create({
        _id: uuid(),
        spotify_id: song.spotify_id,
        name: song.name,
        artist: song.artist,
        album: song.album,
        reviews: [],
      });
    }

    //Adding reviews
    for (const song of songs) {
      // Review 1
      const review1 = await Review.create({
        _id: uuid(),
        song_id: song.spotify_id,
        user_id: createdUserList[1].userId,
        rating: 4, // Example rating
        text: `Great song! Really enjoyed listening to "${song.name}" by ${song.artist}.`,
        created_at: new Date(),
        updated_at: "",
      });
      await review1.save();

      await Song.findByIdAndUpdate(song._id, { $push: { reviews: review1._id } });
      await User.findByIdAndUpdate(createdUserList[1].userId, { $push: { reviews: review1._id } });

      // Review 2
      const review2 = await Review.create({
        _id: uuid(),
        song_id: song.spotify_id,
        user_id: createdUserList[2].userId,
        rating: 5, // Example rating
        text: `Absolutely love this track! "${song.name}" is fantastic.`,
        created_at: new Date(),
        updated_at: "",
      });
      await review2.save();

      await Song.findByIdAndUpdate(song._id, { $push: { reviews: review2._id } });
      await User.findByIdAndUpdate(createdUserList[2].userId, { $push: { reviews: review2._id } });
    }
  
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
