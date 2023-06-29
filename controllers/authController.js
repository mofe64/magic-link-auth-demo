import User from "../models/user.js";
import ApplicationError from "../util/appError.js";
import { v4 as uuidv4 } from "uuid";
import { Resend } from "resend";
import catchAsync from "../util/catchAsync.js";
import JWT from "jsonwebtoken";
import { promisify } from "util";

export const startLogin = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    return next(new ApplicationError(400, "Please provide your email"));
  }
  const token = uuidv4();
  const now = new Date();
  const tokenExpiry = new Date(now.getTime() + 15 * 60000);
  const user = await User.findOne({ email });
  if (!user) {
    await User.create({
      email,
      token,
      tokenExpiry,
    });
  } else {
    if (user.tokenExpiry > now) {
      return next(
        new ApplicationError(
          400,
          "A magic sign in link has already been sent to your email. Click the link to login"
        )
      );
    }
    user.token = token;
    user.tokenExpiry = tokenExpiry;
    await user.save();
  }
  const resend = new Resend(process.env.resend_api_key);

  const data = await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Magic sign in link",
    html: `<table cellpadding="0" cellspacing="0" border="0" width="100%" bgcolor="#f1f1f1">
    <tr>
      <td align="center">
        <table cellpadding="0" cellspacing="0" border="0" width="600" style="border-collapse: collapse;">
          <tr>
            <td align="center" style="padding: 40px 0;">
              <h1 style="font-size: 24px; margin: 0;">Welcome</h1>
              <p style="font-size: 16px; margin: 20px 0 0;">Click the link below to get signed in.</p>
              <p style="margin-top: 30px;">
                <a onclick="window.open('http:localhost:3000/api/v1/auth/verify?token=${token}', '_blank')" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #ffffff; text-decoration: none; font-size: 16px; border-radius: 4px;">Sign in</a>
              </p>
              <p>
                if the button above doesn't work, copy and the paste the following link in your browser
              </p>
              <p>
                http:localhost:3000/api/v1/auth/verify?token=${token}
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
      `,
  });
  console.log(data);

  console.log("email recieved --> ", email);
  console.log("url --> ", req.originalUrl);
  return res.status(200).json({
    success: true,
  });
});

export const verifyLink = catchAsync(async (req, res, next) => {
  const { token } = req.query;
  console.log("recieved token --> ", token);
  const user = await User.findOne({ token });
  if (!user) {
    return next(new ApplicationError(400, "No user found for provided token"));
  }
  const now = new Date();
  if (user.tokenExpiry < now) {
    return next(
      new ApplicationError(400, "Token provided expired, please log in again")
    );
  }
  user.token = undefined;
  user.tokenExpiry = undefined;
  await user.save();

  const jwtToken = JWT.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    secure: false,
    httpOnly: true,
  };
  res.cookie("jwt", jwtToken, options);
  res.status(200).redirect("/");
});

export const authenticate = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  if (!token) {
    return next(
      new ApplicationError(401, "You are not logged in, log in to gain access")
    );
  }
  //verify token
  const decoded = await promisify(JWT.verify)(token, process.env.JWT_SECRET);
  //check is user on token still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new ApplicationError(401, "User on this token no longer exists")
    );
  }

  //grant access
  req.user = currentUser;
  res.locals = currentUser;
  next();
});

export const logout = catchAsync(async (req, res, next) => {
  console.log("logging out");
  res.clearCookie("jwt");
  res.status(200).json({ success: true });
});
