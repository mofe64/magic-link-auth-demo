import express from "express";
import path from "path";
import cookieParser from "cookie-parser";

const app = express();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json({ limit: "10kb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: false }));
app.use(cookieParser());

export default app;
