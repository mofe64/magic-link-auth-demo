import express from "express";
import { getLogin } from "../controllers/viewController.js";

const viewRouter = express();
viewRouter.route("/login").get(getLogin);

export default viewRouter;
