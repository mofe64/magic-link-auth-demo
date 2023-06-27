export const startLogin = async (req, res, next) => {
  const { email } = req.body;
  console.log("email recieved --> ", email);
  return res.status(200).json({
    success: true,
  });
};
