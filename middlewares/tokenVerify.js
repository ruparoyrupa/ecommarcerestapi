import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/User.js";

const tokenVerify = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader) {
    return res.status(400).json({ message: "You are not authorized" });
  }
  const token = authHeader.split(" ")[1];
  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET,
    asyncHandler(async (err, decode) => {
      if (err) {
        return res.status(400).json({ message: "Invalid Token" });
      }

      const me = await User.findOne({ email: decode.email });
      // const role = await User.findOne({ role: decode.role });
      req.me = me;
      // req.role = role;
      next();
    })
  );
};

export default tokenVerify;
