import express from "express";
import path, { dirname } from "path";
import cookieParser from "cookie-parser";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import viewRouter from "./routers/viewRouter.js";
import authRouter from "./routers/authRouter.js";
import { errorController, errorLogger } from "./controllers/errorController.js";

// set up file directory strcture and get directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// set up express app
const app = express();
// set up view engine and directory for our view templates
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// link express to our static directory, so express can find our static files (css, js)
app.use(express.static(path.join(__dirname, "public")));
// allow express accept json payloads in request body
app.use(express.json({ limit: "10kb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: false }));
// allow express process cookies
app.use(cookieParser());

// link our routers with express
app.use("", viewRouter);
app.use("/api/v1/auth", authRouter);

// for all routers not included in our routers, send back an error reponse stating that the
// route is not available on this server
app.use("*", (req, res, next) => {
  return res.status(400).json({
    success: false,
    message: `can't find ${req.originalUrl} on this server`,
  });
});

// set up express to use our global error handler and error logger middlewares
app.use(errorController);
app.use(errorLogger);

export default app;
