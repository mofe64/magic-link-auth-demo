export const errorController = (error, req, res, next) => {
  console.log("recieved error -->", error.constructor.name);
  console.log("recieved error -->", error);
  const customError =
    error.constructor.name === "NodeError" ||
    error.constructor.name === "SyntaxError"
      ? false
      : true;
  res.status(error.statusCode || 500).json({
    response: "Error",
    error: {
      type: customError === false ? "UnhandledError" : error.constructor.name,
      path: req.path,
      statusCode: error.statusCode || 500,
      message: error.message,
    },
  });
  next(error);
};

export const errorLogger = (error, req, res, next) => {
  const customError =
    error.constructor.name === "NodeError" ||
    error.constructor.name === "SyntaxError"
      ? false
      : true;

  console.log("ERROR");
  console.log(
    `Type: ${
      error.constructor.name === "NodeError"
        ? "UnhandledError"
        : error.constructor.name
    }`
  );
  console.log("Path: " + req.path);
  console.log(`Status code: ${error.statusCode || 500}`);
  console.log(error.stack);
};
