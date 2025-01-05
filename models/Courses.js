import mongoose from "mongoose";

const { Schema } = mongoose;

const courseSchema = new Schema({
  title: { type: String, required: true },
  subTitle: { type: String, required: true },
  thumbnail: { type: String, required: true, },
  description: { type: String, required: true },
  courseDuration: { type: String, required: true },
  courseTimming: { type: String },
  courseLevel: { type: String, default: "beginner", enum: ['beginner', 'intermediate', 'advance'] },
  batch: { type: String },
  teacherId: { type: mongoose.Schema.Types.ObjectID, ref: "Users" },
  studentsId: [{ type: mongoose.Schema.Types.ObjectID, ref: "Users" }],
  activeDate: { type: String },
  endDate: { type: String },
},
  {
    timestamps: true,
  },
);

export const courseModel = mongoose.model("Course", courseSchema);
