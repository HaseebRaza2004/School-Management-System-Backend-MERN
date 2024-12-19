import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema(
    {
        fullName: String,
        email: String,
    },
    {
        timestamps: true,
    }
);

export const UserModel = mongoose.model("Users", userSchema);
