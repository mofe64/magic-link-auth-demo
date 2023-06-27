import express from "express";
import { startLogin } from "../controllers/authController.js";

const authRouter = express();
authRouter.route("/login").post(startLogin);

export default authRouter;
