import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./db/db.js";
import userRoutes from "./routes/userRoutes.js";
import mapRoutes from "./routes/mapRoutes.js";
import captainRoutes from "./routes/captainRoutes.js";
import rideRoutes from "./routes/rideRoutes.js";
import cookieParser from "cookie-parser";

dotenv.config();
connectDB();
const app = express();
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://0j5nddp5-5173.inc1.devtunnels.ms",
    ], // Your frontend origin
    credentials: true, // Allow credentials (cookies)
  })
);

app.use(express.json());
app.use(cookieParser());
app.use("/api/users", userRoutes);
app.use("/api/captains", captainRoutes);
app.use("/api/maps", mapRoutes);
app.use("/api/rides", rideRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

export default app;
