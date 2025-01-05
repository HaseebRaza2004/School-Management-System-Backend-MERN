import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema(
    {
        provider: { type: String },
        providerId: { type: String },
        name: { type: String },
        email: { type: String, unique: true, required: true },
        profilePhoto: { type: String },
        role: { type: String, default: "student", enum: ["student", "teacher", "admin"] },
        token: { type: String || "" },
        enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
    },
    
    {
        timestamps: true,
    },
);

export const UserModel = mongoose.model("Users", userSchema);