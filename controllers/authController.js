import User from "../models/user.js";
import ApplicationError from "../util/appError.js";
import { v4 as uuidv4 } from "uuid";
import { Resend } from "resend";
import catchAsync from "../util/catchAsync.js";

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
                <a href="localhost:3000/api/v1/auth/verify?token=${token}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #ffffff; text-decoration: none; font-size: 16px; border-radius: 4px;">Sign in</a>
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
  return res.status(200).json({
    success: true,
  });
});
