const httpError = (status, message) => {
  const Error = new Error(message);
  error.status = status;
  return error;
};

module.exports = httpError;
