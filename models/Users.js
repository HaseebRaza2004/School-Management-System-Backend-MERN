import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema(
    {
        fullName: { type: String },
        email: { type: String, unique: true, required: true },
        password: { type: String, required: true },
        role: { type: String, default: "student", enum: ["student", "teacher", "admin"] },
        token: {type:String || ""},
    },
    {
        timestamps: true,
    },
);

export const UserModel = mongoose.model("Users", userSchema);
