import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import blacklistedTokenModel from "../models/blacklistedTokenModel.js";

const authUser = async (req, res, next) => {
  const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Not authorized" });
  }

  const isTokenBlacklisted = await blacklistedTokenModel.findOne({ token });

  if (isTokenBlacklisted) {
    return res.status(401).json({ message: "Token BlackListed" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;
    return next();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export { authUser };
