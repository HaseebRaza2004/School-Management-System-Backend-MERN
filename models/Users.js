import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema(
    {
        provider: { type: String },
        providerId: { type: String },
        name: { type: String },
        email: { type: String, unique: true, required: true },
        password: { type: String, required: true },
        profilePhoto: { type: String },
        role: { type: String, default: "student", enum: ["student", "teacher", "admin"] },
        token: { type: String || "" },
    },
    {
        timestamps: true,
    },
);

export const UserModel = mongoose.modal("Users", userSchema);
