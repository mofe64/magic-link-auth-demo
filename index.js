import mongoose from "mongoose";
import dotenv from "dotenv";
import app from "./app.js";

// load our config variables
dotenv.config({ path: "./config.env" });

// set up our mongodb database connection via mongoose
mongoose
  .connect(process.env.DATABASE_URL, {
    family: 4,
  })
  .then(() => console.log("DB connection successful"))
  .catch((err) => console.log("error connecting to mongo db ---> ", err));

const port = process.env.PORT || 3000;

// set up our sever on our set port
const server = app.listen(port, () => {
  console.log(`App running on port ${port}....`);
});

// on any unhandled promise rejections, log the error that caused it
// and shut down server
process.on("unhandledRejection", (err) => {
  console.log("unhandled rejection, Shutting down....");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
