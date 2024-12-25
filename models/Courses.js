import mongoose from "mongoose";

const { Schema } = mongoose;

const courseSchema = new Schema({
  title: { type: String, required: true },
  thumbnail: {
    type: String,
    required: true,
  },
  description: { type: String, required: true },
  speciality: { type: String, required: true },
  teacher: { type: mongoose.Schema.Types.ObjectID, ref: "Teacher" },
  students: [{ type: mongoose.Schema.Types.ObjectID, ref: "Student" }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const courseModal = mongoose.modal("Course", courseSchema);
