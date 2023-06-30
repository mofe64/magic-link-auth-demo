import mongoose from "mongoose";
import validator from "validator";

// user schema to store user details in the database
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "email is required"],
    unique: [true, "This email is already taken, please try another"],
    validate: [validator.isEmail, "please provide a valid email"],
  },
  token: {
    type: String,
  },
  tokenExpiry: Date,
});

// create a user model from the above schema
const User = mongoose.model("User", userSchema);
export default User;
