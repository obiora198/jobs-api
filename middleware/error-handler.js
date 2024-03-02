const { StatusCodes } = require("http-status-codes");

const errorHandlerMiddleware = (err, req, res, next) => {
  const CustomError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || "something went wrong, please try again later",
  };
  if (err.name === "ValidationError") {
    CustomError.msg = Object.values(err.errors)
      .map((item) => item.message)
      .join(", ");
    CustomError.statusCode = 400;
  }
  if (err.code && err.code === 11000) {
    CustomError.msg = `duplicate value entered for ${Object.keys(
      err.keyValue
    )} field, please choose another value`;
    CustomError.statusCode = 400;
  }
  if(err.name === 'CastError') {
    CustomError.msg = `No item with id : ${err.value}`
    CustomError.statusCode = 404
  }
  return res.status(CustomError.statusCode).json({ msg: CustomError.msg });
  return res.status(CustomError.statusCode).json({ msg: err });
};

module.exports = errorHandlerMiddleware;
