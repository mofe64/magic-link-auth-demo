import express from "express";
import path, { dirname } from "path";
import cookieParser from "cookie-parser";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import viewRouter from "./routers/viewRouter.js";
import authRouter from "./routers/authRouter.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
console.log(path.join(__dirname, "public", "styles"));

const app = express();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json({ limit: "10kb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: false }));
app.use(cookieParser());

app.use("", viewRouter);
app.use("/api/v1/auth", authRouter);

export default app;
