export const errorController = (error, req, res, next) => {
  // console.log("recieved error -->", error.constructor.name);
  // console.log("recieved error -->", error);

  if (
    error.constructor.name === "NodeError" ||
    error.constructor.name === "SyntaxError"
  ) {
    res.status(500).json({
      response: "Error",
      type: "UnhandledError",
      path: req.path,
      statusCode: error.statusCode || 500,
      message: error.message,
    });
  } else if (error.constructor.name === "ValidationError") {
    const fields = Object.values(error.errors).map((el) => el.message);
    const message = `validation failed . ${fields.join(". ")}`;
    res.status(400).json({
      response: "Error",
      error: {
        type: error.constructor.name,
        path: req.path,
        statusCode: 400,
        message: message,
      },
    });
  } else {
    if (error.statusCode === 401) {
      res.status(401).redirect("/login");
    } else {
      res.status(error.statusCode || 500).json({
        response: "Error",
        error: {
          type: error.constructor.name,
          path: req.path,
          statusCode: error.statusCode || 500,
          message: error.message,
        },
      });
    }
  }
  next(error);
};

export const errorLogger = (error, req, res, next) => {
  const customError =
    error.constructor.name === "NodeError" ||
    error.constructor.name === "SyntaxError"
      ? false
      : true;

  console.log("FROM ERROR LOGGER --> ERROR");
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
