// utility wrapper middleware that we use to wrap all asynchronous method calls
// within our application
// By wrapping asynchronous functions with the catchAsync middleware,
// we handle errors in a more concise and consistent manner,
// reducing the need for repetitive error handling code in each individual controller
// or handler function.
const catchAsync = (fn) => {
  return (req, res, next) => {
    // Call the provided function (controller/handler) and catch any errors
    fn(req, res, next).catch(next);
  };
};

export default catchAsync;
