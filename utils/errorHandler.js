function errorHandler(statusCode, message, res) {
  res.status(statusCode).send({ message });
}

module.exports = {
  errorHandler,
};
