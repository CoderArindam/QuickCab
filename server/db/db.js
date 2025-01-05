import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connection = await mongoose
      .connect(process.env.MONGO_URI)
      .then(() => {
        console.log("Database connected");
      });
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

export default connectDB;
