export const getLogin = async (req, res, next) => {
  res.status(200).render("login");
};

export const getHome = async (req, res, next) => {
  const user = req.user;
  res.status(200).render("home", {
    email: user.email,
  });
};
