// method to render the login screen
export const getLogin = async (req, res, next) => {
  res.status(200).render("login");
};

// method to render the home screen
export const getHome = async (req, res, next) => {
  // extract the authenticated user from the request
  const user = req.user;
  // render the home template and pass the user's email to the template
  // as props
  res.status(200).render("home", {
    email: user.email,
  });
};
