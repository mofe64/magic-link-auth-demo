import mongoose from "mongoose";
import dotenv from "dotenv";
import app from "./app.js";

dotenv.config({ path: "./config.env" });
console.log(process.env.DATABASE_URL);

mongoose
  .connect(process.env.DATABASE_URL, {
    family: 4,
  })
  .then(() => console.log("DB connection successful"))
  .catch((err) => console.log("error connecting to mongo db ---> ", err));

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log(`App running on port ${port}....`);
});

process.on("unhandledRejection", (err) => {
  console.log("unhandled rejection, Shutting down....");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
