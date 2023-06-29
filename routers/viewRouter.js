import express from "express";
import { getHome, getLogin } from "../controllers/viewController.js";
import { authenticate } from "../controllers/authController.js";

const viewRouter = express();
viewRouter.route("/login").get(getLogin);
viewRouter.route("").get(authenticate, getHome);

export default viewRouter;
