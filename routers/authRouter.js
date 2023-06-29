import express from "express";
import {
  startLogin,
  verifyLink,
  logout,
} from "../controllers/authController.js";

const authRouter = express();
authRouter.route("/login").post(startLogin);
authRouter.route("/logout").get(logout);
authRouter.route("/verify").get(verifyLink);

export default authRouter;
