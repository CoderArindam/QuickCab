import captainModel from "../models/captainModel.js";

const createCaptain = async (
  firstName,
  lastName,
  email,
  password,
  color,
  plateNumber,
  capacity,
  vehicleType
) => {
  if (
    !firstName ||
    !email ||
    !password ||
    !color ||
    !plateNumber ||
    !capacity ||
    !vehicleType
  ) {
    throw new Error("Please provide required fields");
  }
  const captain = captainModel.create({
    fullName: {
      firstName,
      lastName,
    },
    email,
    password,
    vehicle: {
      color,
      plateNumber,
      capacity,
      vehicleType,
    },
  });
  return captain;
};

export { createCaptain };
