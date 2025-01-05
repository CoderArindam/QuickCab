import userModel from "../models/userModel.js";
import { createUser } from "../services/userService.js";
import { validationResult } from "express-validator";
const registerUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { fullName, email, password } = req.body;
  const { firstName, lastName } = fullName;
  const hashPassword = await userModel.hashPassword(password);

  try {
    const user = await createUser(firstName, lastName, email, hashPassword);
    const token = user.generateAuthToken();
    return res.status(201).json({ token, user });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export { registerUser };
