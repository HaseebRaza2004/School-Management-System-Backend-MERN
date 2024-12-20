import express from "express";
import morgan from "morgan";
import 'dotenv/config';
import mongoose from "mongoose";
import userRoutes from "./routers/Users.js";
import authRoutes from "./routers/Auth.js";

const app = express();
const PORT = 4000;

app.use(morgan("tiny"));
app.use(express.json());

// MongoDB connected
mongoose
  .connect(process.env.MONGODBURI)
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch((error) => console.log("Error =>", error));


app.use("/users", userRoutes);
app.use("/auth", authRoutes)

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
