const User = require(`../models/users`);
const { SECRET_KEY } = require(`../config`);
const { httpError, sendEmail } = require(`../helpers`);
const fs = require(`fs/promises`);
const path = require(`path`);
const bcrypt = require(`bcrypt`);
const jwt = require(`jsonwebtoken`);
const joi = require(`../helpers/joiUsers`);
const gravatar = require(`gravatar`);
const resizeAvatar = require(`../helpers/jimp`);
const { nanoid } = require("nanoid");
const { json } = require("express");

//
const register = async (req, res, next) => {
  try {
    const { error } = joi.registerSchema.validate(req.body);
    if (error) {
      throw httpError(400, error.message);
    }
    // Password
    const { email, password } = req.body;
    const hashPassword = await bcrypt.hash(password, 10);
    // Avatar
    const avatarURL = gravatar.url(email);
    // VerifyCode
    const verificationToken = nanoid();
    // New User
    const newUser = await User.create({
      ...req.body,
      avatarURL,
      password: hashPassword,
      verificationToken,
    });
    await sendEmail({ email, verificationToken: newUser.verificationToken });

    res.status(201).json({
      email: newUser.email,
      subscription: newUser.subscription,
      avatarURL: newUser.avatarURL,
    });
  } catch (error) {
    if (error.name === `MongoServerError` && error.code === 11000) {
      next(httpError(409, "Email in use"));
    }
    next(httpError(400, error.message));
  }
};

const login = async (req, res, next) => {
  try {
    const { error } = joi.loginSchema.validate(req.body);
    if (error) {
      throw httpError(400, error.message);
    }
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw httpError(401, "Email or password is wrong");
    }
    if (!user.verify) {
      throw httpError(404, "User is unverified");
    }
    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
      throw httpError(401, "Email or password is wrong");
    }
    const payload = {
      id: user._id,
    };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: `23h` });
    await User.findByIdAndUpdate(user._id, { token });
    res.status(200).json({
      token,
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};
//
const verify = async (req, res, next) => {
  const { verificationToken } = req.params;
  const user = await User.findOne({ verificationToken });
  if (!user) {
    throw httpError(404, "User not found");
  }
  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationToken: null,
  });
  res.status(200).json({
    message: "Verification successful",
  });
};
//
const resendVerifyEmail = async (req, res, next) => {
  const { error, email } = joi.resendVerifyEmail.validate(req.body);
  if (error) {
    throw httpError(400, "missing required field email");
  }
  const user = await user.findOne({ email });
  if (!user) {
    throw httpError(400, "Email not found");
  }
  if (user.verify) {
    throw httpError(400, `Verification has already been passed`);
  }
  await sendEmail({ email, verificationToken: user.verificationToken });
  res.status(200).json({ message: "Verification email sent" });
};
//
const getCurrent = async (req, res, next) => {
  try {
    const { email, subscription } = req.user;
    res.status(200).json({
      email,
      subscription,
    });
  } catch {
    next(httpError(401, "Not authorized"));
  }
};
//
const logOut = async (req, res, next) => {
  try {
    const { _id } = req.user;
    await User.findByIdAndUpdate({ token: "" });
    res.status(204);
  } catch {
    next(httpError(401, "Not authorized"));
  }
};
//
const updateAvatar = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const avatarDir = path.join(__dirname, `..`, `public`, `avatars`);
    const { path: tempUpload, originalname } = req.file;
    resizeAvatar(tempUpload);
    const filename = `${_id}_${originalname}`;
    const resultUpload = path.join(avatarDir, filename);
    await fs.rename(tempUpload, resultUpload);
    const avatarURL = path.join(`public`, `avatars`, filename);
    User.findByIdAndUpdate(_id, { avatarURL });
    res.status(200).json({
      avatarURL,
    });
  } catch {
    next(httpError(401)`Oops,something went wrong`);
  }
};
//
module.exports = {
  register,
  login,
  getCurrent,
  logOut,
  updateAvatar,
  verify,
  resendVerifyEmail,
};
