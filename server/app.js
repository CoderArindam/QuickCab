import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./db/db.js";
import userRoutes from "./routes/userRoutes.js";
import captainRoutes from "./routes/captainRoutes.js";
import cookieParser from "cookie-parser";

dotenv.config();
connectDB();
const app = express();
app.use(cors());

app.use(express.json());
app.use(cookieParser());
app.use("/api/users", userRoutes);
app.use("/api/captains", captainRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

export default app;
