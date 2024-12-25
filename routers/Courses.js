import express from "express";
import { CourseModal } from "../models/Courses.js";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        let users = await CourseModal.find();
        res.status(200).json({
            error: false,
            users: users,
            message: "All Courses fetched successfully",
        });
    } catch (error) {
        res.status(404).json({
            error: true,
            message: "Failed to fetch courses",
        });
    }
});

// Add Course To DB
router.post("/", async (req, res) => {
    try {
        const course = req.body;
        let newCourse = new CourseModal(course);
        newCourse = await newCourse.save();
        res.status(200).json({
            error: false,
            course: newCourse,
            message: "Course Added successfully",
        });
    } catch (error) {
        res.status(404).json({
            error: true,
            message: "Failed to add course",
        });
    }
});

// Get Single Course By Id
router.get("/:id", async (req, res) => {
    try {
        const course = await CourseModal.findById(req.params.id);
        if (!course) {
            return res.status(404).json({
                error: true,
                message: "Course Not Found",
            })
        };
        res.status(200).json({
            error: false,
            course,
            message: "course fetched successfully",
        });
    } catch (error) {
        res.status(404).json({
            error: true,
            message: "course Not Found",
        });
    }
});

// Update Single course
router.put("/:id", async (req, res) => {
    try {
        const { title, thumbnail, description } = req.body;
        const courseInDb = await CourseModal.findById(req.params.id);
        if (!courseInDb) {
            return res.status(404).json({
                error: true,
                message: "Course Not Found",
            })
        };
        if (title) courseInDb.title = title;
        if (thumbnail) courseInDb.thumbnail = thumbnail;
        if (description) courseInDb.description = description;
        await courseInDb.save();
        res.status(200).json({
            error: false,
            courseInDb,
            message: "Course Updated successfully",
        });
    } catch (error) {
        res.status(404).json({
            error: true,
            message: "Course Not Found",
        });
    }
});

// Delete Course
router.delete("/:id", async (req, res) => {
    try {
        const courseInDb = await CourseModal.findById(req.params.id);
        if (!courseInDb) {
            return res.status(404).json({
                error: true,
                message: "User Not Found",
            })
        };
        await CourseModal.deleteOne({ _id: req.params.id })
        res.status(200).json({
            error: false,
            userInDb: null,
            message: "Course Deleted successfully",
        });
    } catch (error) {
        res.status(404).json({
            error: true,
            message: "Course Not Found",
        });
    }
});

export default router;