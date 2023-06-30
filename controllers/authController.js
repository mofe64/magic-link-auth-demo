import User from "../models/user.js";
import ApplicationError from "../util/appError.js";
import { v4 as uuidv4 } from "uuid";
import catchAsync from "../util/catchAsync.js";
import JWT from "jsonwebtoken";
import { promisify } from "util";
import nodemailer from "nodemailer";

// controller method to generate unique login code and send login email
export const startLogin = catchAsync(async (req, res, next) => {
  // Extract the submitted email
  const { email } = req.body;
  if (!email) {
    // If no email was provided, create anew application error and pass it
    // off to the global error handler
    return next(new ApplicationError(400, "Please provide your email"));
  }
  // create a unique token
  const token = uuidv4();
  const now = new Date();
  // set the token's expiry to be 15 minutes from now
  const tokenExpiry = new Date(now.getTime() + 15 * 60000);
  // check to see if the email provided exists in our database
  const user = await User.findOne({ email });
  // if user doesn't exist create the user
  if (!user) {
    await User.create({
      email,
      token,
      tokenExpiry,
    });
  } else {
    // if the user exists, check to see if has a valid unexpired token
    if (user.token && user.tokenExpiry > now) {
      // create a new error telling the user that a magic link has already been
      // sent to his email, and they have to wait 15 minutes for old token to
      // expire before requesting a new one
      return next(
        new ApplicationError(
          400,
          "A magic sign in link has already been sent to your email. Click the link to login, or wait 15 minutes for the old token to expire before requesting another"
        )
      );
    }
    // if user does not have a valid unexpired token
    // set his token and token expiry values
    user.token = token;
    user.tokenExpiry = tokenExpiry;
    // save user details
    await user.save();
  }

  // create a nodemailer transporter configured to use gmail smtp to send email
  const transporter = nodemailer.createTransport({
    port: 465,
    host: "smtp.gmail.com",
    auth: {
      user: "zallyassessment@gmail.com",
      pass: "ttofuvrcnopfktrp",
    },
    secure: true,
  });
  // email details
  const mailData = {
    from: "zallyassessment@gmail.com",
    to: email,
    subject: "Magic link sign in",
    text: "Sign in",
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
  };

  // send the email via our transporter with a callback to handle success and errors
  transporter.sendMail(mailData, function (err, info) {
    // if email fails, log err and create an application error then pass
    // error off to global error handler
    if (err) {
      console.log(err);
      return next(
        new ApplicationError(500, "something went wrong sending your email")
      );
    } else {
      console.log(info);
    }
  });

  console.log("email recieved --> ", email);
  console.log("url --> ", req.originalUrl);
  // return a 200 status response
  return res.status(200).json({
    success: true,
  });
});

export const verifyLink = catchAsync(async (req, res, next) => {
  // extract the token from the request query
  const { token } = req.query;
  console.log("recieved token --> ", token);
  // find the user associated with the token
  const user = await User.findOne({ token });
  // if there is not user associated with the token, then create an error and
  // pass it off to glbacl error handler
  if (!user) {
    return next(new ApplicationError(400, "No user found for provided token"));
  }

  const now = new Date();
  // check if token has expired return error if so
  if (user.tokenExpiry < now) {
    return next(
      new ApplicationError(400, "Token provided expired, please log in again")
    );
  }
  // since token has been used reset user token and user token expire
  user.token = undefined;
  user.tokenExpiry = undefined;
  await user.save();

  // create unique jwt token with user id embedded
  const jwtToken = JWT.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  // define cookie options
  // secure is set to false since dev environment is http only
  // in prod, it should be true to ensure cookie is only sent via https
  // httpOnly is set to true to esnure that the cookie inaccessible to
  // client-side JavaScript. This enhances the security of the cookie
  // by preventing cross-site scripting (XSS) attacks.
  // The expires property sets the expiration date for the cookie.
  // It uses Date.now() to get the current timestamp and adds a duration
  // calculated by multiplying
  // process.env.JWT_COOKIE_EXPIRES_IN (which represents the number of days)
  // with 24 * 60 * 60 * 1000 (which represents the number of milliseconds in a day).
  // This ensures that the cookie will expire after the specified number of days.
  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    secure: false,
    httpOnly: true,
  };
  // set cookie in response containing our jwt and cookie option
  res.cookie("jwt", jwtToken, options);
  // return 200 status code and redirec to home
  res.status(200).redirect("/");
});

// middle ware used to protect specified routes
export const authenticate = catchAsync(async (req, res, next) => {
  let token;
  // if the request has an authorization header with a bearer token
  // extract token from the auth header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
    // if request has a jwt cookie, extract token from cookie
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  // if not token, return an unauthorized error
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
  // store the user obj inside the incoming request object
  req.user = currentUser;
  res.locals = currentUser;
  next();
});

export const logout = catchAsync(async (req, res, next) => {
  console.log("logging out");
  // clear the jwt cookie on logout
  res.clearCookie("jwt");
  // return success
  res.status(200).json({ success: true });
});
