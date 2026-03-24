import express, { Application } from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import dns from "dns";

import authRoutes from "./routes/auth";
import noteRoutes from "./routes/notes";

dotenv.config();

dns.setDefaultResultOrder("ipv4first");

const app: Application = express();


app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI as string, {
  family: 4
})
.then(() => {
  console.log("MongoDB Connected");
})
.catch((err) => {
  console.error("Mongo Error:", err);
});


app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);


app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});