import express from "express";
import { startLogin, verifyLink } from "../controllers/authController.js";

const authRouter = express();
authRouter.route("/login").post(startLogin);
authRouter.route("/verify").get(verifyLink);

export default authRouter;
