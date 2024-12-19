import express from "express";
import { UserModel } from "../models/Users.js";

const router = express.Router();

// Get All Users
router.get("/", async (req, res) => {
    try {
        let users = await UserModel.find();
        res.status(200).json({
            error: false,
            users: users,
            message: "All Users fetched successfully",
        });
    } catch (error) {
        res.status(404).json({
            error: true,
            message: "Failed to fetch users",
        });
    }
});

// Add User To DB
router.post("/", async (req, res) => {
    try {
        const user = req.body;
        let newUser = new UserModel(user);
        newUser = await newUser.save();
        res.status(200).json({
            error: false,
            user: newUser,
            message: "User Added successfully",
        });
    } catch (error) {
        res.status(404).json({
            error: true,
            message: "Failed to add user",
        });
    }
});

// Get Single User By Id
router.get("/:id", async (req, res) => {
    try {
        const user = await UserModel.findById(req.params.id);
        if (!user) {
            return res.status(404).json({
                error: true,
                message: "User Not Found",
            })
        };
        res.status(200).json({
            error: false,
            user,
            message: "User fetched successfully",
        });
    } catch (error) {
        res.status(404).json({
            error: true,
            message: "User Not Found",
        });
    }
});

// Update Single user
router.put("/:id", async (req, res) => {
    try {
        const { email, fullName } = req.body;
        const userInDb = await UserModel.findById(req.params.id);
        if (!userInDb) {
            return res.status(404).json({
                error: true,
                message: "User Not Found",
            })
        };
        if (email) userInDb.email = email;
        if (fullName) userInDb.fullName = fullName;
        await userInDb.save();
        res.status(200).json({
            error: false,
            userInDb,
            message: "User Updated successfully",
        });
    } catch (error) {
        res.status(404).json({
            error: true,
            message: "User Not Found",
        });
    }
});

// Delete User
router.delete("/:id", async (req, res) => {
    try {
        const userInDb = await UserModel.findById(req.params.id);
        if (!userInDb) {
            return res.status(404).json({
                error: true,
                message: "User Not Found",
            })
        };
        await UserModel.deleteOne({ _id: req.params.id })
        res.status(200).json({
            error: false,
            userInDb: null,
            message: "User Deleted successfully",
        });
    } catch (error) {
        res.status(404).json({
            error: true,
            message: "User Not Found",
        });
    }
});

export default router;
