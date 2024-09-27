const jwt = require(`jsonwebtoken`);
const httpError = require(`./httpError`);
const { SECRET_KEY } = require(`../config`);
const User = require(`../models/users`);

const authenticate = async (req, res, next) => {
  const token =
    req.headers.authorization?.startsWith("Bearer") &&
    req.headers.authorization.split(" ")[1];

  try {
    const { id } = jwt.verify(token, SECRET_KEY);
    const user = await User.findById(id);
    if (!user || !user.token || user.token !== token) {
      next(httpError(401, `User ${user} not found`));
    }
    req.user = user;
    next();
  } catch {
    next(httpError(401, "Email or password is wrong(catch)"));
  }
};

module.exports = authenticate;
