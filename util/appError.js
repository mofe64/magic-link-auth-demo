// custom error object to use within our application
// extends the javascript error object
class ApplicationError extends Error {
  statusCode;
  constructor(statusCode, message) {
    super(message);

    Object.setPrototypeOf(this, new.target.prototype);
    this.name = Error.name;
    this.statusCode = statusCode;
    Error.captureStackTrace(this);
  }
}

export default ApplicationError;
