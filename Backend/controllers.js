const ctrl = {};
const crypto = require("crypto");
const User = require("./models/User");
const Review = require("./models/Review");
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
  try {
    await Comment.updateOne({ id: id }, { content: content });
    return res.status(200).json({
      ok: true,
      message: "Comment updated successfully",
    });
  } catch (error) {
    
  }
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
  try {
    await Comment.findOneAndDelete({ id: id });
    return res.status(200).json({
      ok: true,
      message: "Comment deleted successfully",
    });
  } catch (error) {
    console.error(error);
  }
};

ctrl.likeAComment = async (req, res) => {
  const { id, userId, liked } = req.body;
  const findComment = await Comment.findOne({ id: id });
  console.log(findComment);
  if (!findComment) {
    return res.status(404).json({
      ok: false,
      message: "Comment not found",
    });
  }
  if (!liked) {
    try {
      await Comment.updateOne(
        { id: id },
        { $inc: { likesCount: 1 }, $push: { likes: userId } }
      );
      return res.status(200).json({
        liked: !liked,
      });
    } catch (error) {
      console.error(error);
    }
  }
  if (liked) {
    try {
      await Comment.updateOne(
        { id: id },
        { $inc: { likesCount: -1 }, $pull: { likes: userId } }
      );
      return res.status(200).json({
        liked: !liked,
      });
    } catch (error) {
      console.error(error);
    }
  }
};

ctrl.replyAComment = async (req, res) => {
  const { id, owner, content } = req.body;
  const findComment = await Comment.findOne({ id: id });
  if (!findComment) {
    return res.status(404).json({
      ok: false,
      message: "Comment not found",
    });
  }
  const reply_id = crypto.randomUUID();
  const newReply = {
    id: reply_id,
    owner: owner,
    content: content,
  };
  try {
    await Comment.updateOne(
      { id: id },
      { $inc: { repliesCount: 1 }, $push: { replies: newReply } }
    );
    return res.status(200).json({
      ok: true,
      message: "Reply sent successfully",
    });
  } catch (error) {
    console.error(error);
  }
};

ctrl.submitReview = async (req, res) => {
  const { owner, ownerId, calification, comment, movieId } = req.body;
  const id = crypto.randomUUID();
  const newReview = new Review({
    owner,
    ownerId,
    id: id,
    calification,
    comment,
    movieId,
  });
  try {
    await newReview.save();
    return res
      .status(200)
      .json({ ok: true, message: "Review saved successfully" });
  } catch (error) {
    console.log(error);
  }
};

ctrl.getReviews = async (req, res)=>{
  const {id} = req.params;
  const findReviews = await Review.findOne({'movieId':id})
  if(!findReviews){
    return res.status(404).json({
      ok: false,
      message: 'Reviews not found'
    })
  }
  return res.status(200).json({
    ok: true,
    findReviews
  })

}

ctrl.getComments = async (req, res)=>{
  const {id} = req.params;
  const findComments = await Comment.findOne({'id':id})
  if(!findComments){
    return res.status(404).json({
      ok: false,
      message: 'Comments not found'
    })
  }
  return res.status(200).json({
    ok: true,
    findComments
  })
}


module.exports = ctrl;
