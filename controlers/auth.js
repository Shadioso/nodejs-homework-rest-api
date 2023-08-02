const User = require(`../models/users`);
const { SECRET_KEY } = require(`../config`);
const { httpError } = require(`../helpers`);
const bcrypt = require(`bcrypt`);
const jwt = require(`jsonwebtoken`);
const joi = require(`../helpers/joiUsers`);
//
const register = async (req, res, next) => {
  try {
    console.log(`saasdasd`);
    const { error } = joi.registerSchema.validate(req.body);
    if (error) {
      throw httpError(400, error.message);
    }
    const { password } = req.body;
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ ...req.body, password: hashPassword });
    res.status(201).json({
      email: newUser.email,
      subscription: newUser.subscription,
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
module.exports = {
  register,
  login,
  getCurrent,
  logOut,
};
