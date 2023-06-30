// our global error handler
export const errorController = (error, req, res, next) => {
  // console.log("recieved error -->", error.constructor.name);
  // console.log("recieved error -->", error);

  // if received error is a node error or syntax error, return a 500 error response
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
    // if we get a validation error from our database
  } else if (error.constructor.name === "ValidationError") {
    // extract all fields that fail validation from the database error object
    const fields = Object.values(error.errors).map((el) => el.message);
    // create a custom error message detailing all failing fields
    const message = `validation failed . ${fields.join(". ")}`;
    // return a 400 error response to the user with details about the error
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
    // if we get an unauthorized error, redirect the user to the login screen
    if (error.statusCode === 401) {
      res.status(401).redirect("/login");
    } else {
      // for all other errors, extract details from the error response and return
      // an appropriate error response to user
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

// custom middleware to log error details to our console
// can be modified to log the error to a file system or external server
export const errorLogger = (error, req, res, next) => {
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
  console.log(error);
  console.log(error.stack);
};
