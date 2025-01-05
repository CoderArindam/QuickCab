import userModel from "../models/userModel.js";

const createUser = async (firstName, lastName, email, password) => {
  if (!firstName || !email || !password) {
    throw new Error("Please provide required fields");
  }
  const user = userModel.create({
    fullName: {
      firstName,
      lastName,
    },
    email,
    password,
  });
  return user;
};

export { createUser };
