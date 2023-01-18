const ctrl = {};
const crypto = require("crypto");
const User = require("./models/User");
const bcrypt = require("bcrypt");
const axios = require("axios");
const dotenv = require("dotenv");
const Comment = require("./models/Comment");

dotenv.config();

const TMDBURI = `https://api.themoviedb.org/3/movie/`;
const api_key = process.env.API_KEY;

ctrl.home = (req, res) => {
  res.send("Hello World!");
};

//LOGIN
ctrl.login = async (req, res) => {
  try {
    const { username, password, email } = req.body;
    if (username !== undefined) {
      const findUser = await User.findOne({ username: username });
      if (!findUser) {
        return res.status(404).json({
          ok: false,
          message: "Incorrect username or password",
        });
      }
      const verifyPass = bcrypt.compareSync(password, findUser.password);
      if (!verifyPass) {
        return res.status(404).json({
          ok: false,
          message: "Incorrect username or password",
        });
      }
      return res.status(200).json(findUser);
    }
    if (email !== undefined) {
      const findEmail = await User.findOne({ email: email });
      if (!findEmail) {
        return res.status(404).json({
          ok: false,
          message: "Incorrect username or password",
        });
      }
      console.log(findEmail);
      const verifyPass = bcrypt.compareSync(password, findEmail.password);
      if (!verifyPass) {
        return res.status(404).json({
          ok: false,
          message: "Incorrect username or password",
        });
      }
      return res.status(200).json(findEmail);
    }
  } catch (error) {
    console.log(error);
  }
};

//REGISTER
ctrl.register = async (req, res) => {
  const { username, password, email, dob } = req.body;
  const id = crypto.randomUUID();
  const findUser = await User.findOne({ username: username });
  const findEmail = await User.findOne({ email: email });
  console.log(findUser);
  console.log(findEmail);

  if (findUser) {
    return res.status(404).json({
      ok: false,
      message: "Username already in use",
    });
  }
  if (findEmail) {
    return res.status(404).json({
      ok: false,
      message: "Email already in use",
    });
  }

  //encrypt password
  const salt = bcrypt.genSaltSync();
  const encryptedPassword = bcrypt.hashSync(password, salt);
  const newUser = new User({
    username,
    password: encryptedPassword,
    email,
    dob,
    id,
  });
  try {
    await newUser.save();
    return res.status(200).json({
      ok: true,
      message: "User has been registered",
    });
  } catch (error) {
    console.log(error);
  }
};

ctrl.getMovies = async (req, res) => {
  const { query } = req.body;
  if (query !== undefined) {
    await axios
      .get(`https://api.themoviedb.org/3/movie/${query}?api_key=${api_key}`)
      .then(function (response) {
        return res.send(response.data);
      })
      .catch(function (error) {
        console.error(error);
      });
  }
  //default query si no encuentra un query en el body
  if (query === undefined) {
    await axios
      .get(`https://api.themoviedb.org/3/movie/latest?api_key=${api_key}`)
      .then(function (response) {
        return res.send(response.data);
      })
      .catch(function (error) {
        console.error(error);
      });
  }
};

ctrl.createComment = async (req, res) => {
  const id = crypto.randomUUID();
  const { owner, content } = req.body;
  if (content !== undefined) {
    try {
      const newComent = new Comment({ owner, content, id });
      await newComent.save();
      return res.status(200).json({
        ok: true,
        message: "Comment created successfully",
      });
    } catch (error) {
      console.log(error);
    }
  }
};

ctrl.editComment = async (req, res) => {
  const { id, content } = req.body;
  const findComment = await Comment.findOne({ id: id });
  if (!findComment) {
    return res.status(404).json({
      ok: false,
      message: "Comment not found",
    });
  }
  await Comment.updateOne({ id: id }, { content: content });
  return res.status(200).json({
    ok: true,
    message: "Comment updated successfully",
  });
};

ctrl.deleteComment = async (req, res) => {
  const { id } = req.body;
  const findComment = await Comment.findOne({ id: id });
  if (!findComment) {
    return res.status(404).json({
      ok: false,
      message: "Comment not found",
    });
  }
  await Comment.findOneAndDelete({ id: id });
  return res.status(200).json({
    ok: true,
    message: "Comment deleted successfully",
  });
};

ctrl.likeAComment = async (req, res) => {
  const { id, userId, liked } = req.body;
  const findComment = await Comment.findOne({ "id": id });
  console.log(findComment)
  if (!findComment) {
    return res.status(404).json({
      ok: false,
      message: "Comment not found",
    });
  }
  if(!liked){
    await Comment.updateOne({"id": id},{'$inc': { "likesCount": 1 },  "$push":{'likes': userId}})
    return res.status(200).json({
      liked: !liked
    })
  }
  if(liked){
    await Comment.updateOne({"id": id}, {'$inc':{"likesCount": -1}, "$pull":{'likes': userId}})
    return res.status(200).json({
      liked: !liked
    }); 
  }
};

module.exports = ctrl;
