const ctrl = {};
const crypto = require("crypto");
const User = require("./models/User");
const bcrypt = require("bcrypt");

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

module.exports = ctrl;
