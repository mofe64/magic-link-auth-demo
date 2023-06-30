import express from "express";
import { getHome, getLogin } from "../controllers/viewController.js";
import { authenticate } from "../controllers/authController.js";

// create an express router
const viewRouter = express();

// on get requests to login route, call the get login method
// which renders the login screen
viewRouter.route("/login").get(getLogin);
// on get requests to root, call the get home method
// which renders the home screen.
// The authenticate middleware is called before calling get home to
// ensure that only authenticated users can access the home route
viewRouter.route("").get(authenticate, getHome);

export default viewRouter;
