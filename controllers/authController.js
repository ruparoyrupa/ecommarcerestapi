import User from "../models/User.js";
import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/**
 * @desc login user Request
 * @route POST /auth/login
 * @access PUBLIC
 */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // validation
  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // check user
  const loginUser = await User.findOne({ email });

  if (!loginUser) {
    return res.status(400).json({ message: "Login user not found" });
  }

  // password check
  const passCheck = await bcrypt.compare(password, loginUser.password);

  if (!passCheck) {
    return res.status(400).json({ message: "Wrong password" });
  }

  // access token
  const accessToken = jwt.sign(
    { email: loginUser.email, role: loginUser.role },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRE_IN,
    }
  );

  // refresh token
  const refreshToken = jwt.sign(
    { email: loginUser.email },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRE_IN,
    }
  );

  // now set RT to cookie
  res.cookie("accessToken", accessToken);
  res.status(200).json({ accessToken, refreshToken, user: loginUser });
});

/**
 * @desc Create Refresh token
 * @route GET /auth/refresh
 * @access PUBLIC
 */
export const refresh = (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.rtToken) {
    return res.status(400).json({ message: "You are not authorize" });
  }

  const token = cookies.rtToken;

  jwt.verify(
    token,
    process.env.REFRESH_TOKEN_SECRET,
    asyncHandler(async (err, decode) => {
      if (err) {
        return res.status(400).json({ message: "Invalid Token request" });
      }

      const tokenUser = await User.findOne({ email: decode.email });

      if (!tokenUser) {
        return res.status(400).json({ message: "Invalid User request" });
      }

      // access token
      const accessToken = jwt.sign(
        { email: tokenUser.email, role: tokenUser.role },
        process.env.ACCESS_TOKEN_SECRET,
        {
          expiresIn: "30s",
        }
      );

      res.json({ token: accessToken });
    })
  );
};

/**
 * @desc user logout
 * @route POST /auth/logout
 * @access PUBLIC
 */

export const logout = (req, res) => {
  const cookies = req.cookies;

  if (!cookies.rtToken) {
    return res.status(400).json({ message: "Cookie not found" });
  }

  res
    .clearCookie("rtToken", { httpOnly: true, secure: false })
    .json({ message: "User logged out" });
};
