const { isValidObjectId } = require(`mongoose`);
const { httpError } = require(`./httpError`);

const isValidId = (req, res, next) => {
  const { id } = req.params;
  if (isValidObjectId(id)) {
    next(httpError(400, `${id} is not valid ID`));
  }
  next();
};

module.exports = isValidId;
