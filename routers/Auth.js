import express from "express";
import { UserModel } from "../models/Users.js";
import Joi from "joi";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import 'dotenv/config';

const router = express.Router();

// Define validation schema for registration
const registerSchema = Joi.object({
    fullName: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    password: Joi.string().min(6),
});

// User registration route
router.post("/register", async (req, res) => {
    try {
        // Validate the request body
        const { error, value } = registerSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                error: true,
                message: error.message,
            });
        }

        // Check if the email already exists in the database
        const user = await UserModel.findOne({ email: value.email });
        if (user) {
            return res.status(400).json({
                error: true,
                message: "Email already exists",
            });
        }

        // Hash the user's password
        const hashedPassword = await bcrypt.hash(value.password, 12);
        value.password = hashedPassword;

        // Create a new user object
        let newUser = new UserModel({ ...value });

        // Generate JWT token
        var token = jwt.sign({ id: newUser._id.toString(), email: newUser.email }, process.env.AUTH_SECRET);

        // Save token to the user object
        newUser.token = token;

        // Save the new user in the database
        newUser = await newUser.save();

        // Send response
        res.status(201).json({
            error: false,
            user: { newUser, token },
            message: "User registered successfully!",
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: true,
            message: "Internal server error",
        });
    }
});

export default router;