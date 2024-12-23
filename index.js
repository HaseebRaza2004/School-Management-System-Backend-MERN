// // Required modules
import express from "express";
import morgan from "morgan";
import mongoose from "mongoose";
import passport from "./config/passport.js";
import session from "express-session";
import dotenv from "dotenv";
import userRoutes from "./routers/Users.js";
import authRoutes from "./routers/authroutes.js";
// import authRoutes from "./routers/Auth.js";


// // Load environment variables
dotenv.config();

// // Initialize Express
const app = express();
const PORT = 4000;

// // Middleware
app.use(morgan("tiny"));
app.use(express.json());
app.use(
  session({
    secret: process.env.AUTH_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production", // Use HTTPS in production
      httpOnly: true, // Prevent JavaScript access to cookies
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

// // Connect to MongoDB
mongoose
  .connect(process.env.MONGODBURI)
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch((error) => console.log("Error =>", error));

app.use("/auth", authRoutes);
app.use("/users", userRoutes);

// // Start the server
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));