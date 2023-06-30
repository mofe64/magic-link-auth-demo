import express from "express";
import {
  startLogin,
  verifyLink,
  logout,
} from "../controllers/authController.js";

// create an express router
const authRouter = express();
// on post requests to login route, call the start login method
// which sends the magic link email to the user
authRouter.route("/login").post(startLogin);
// on get requests to logout route, call the logout method
authRouter.route("/logout").get(logout);
// on get requests to verify route, call the verify method
// which verifies the user's magic link
authRouter.route("/verify").get(verifyLink);

export default authRouter;
