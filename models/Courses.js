import mongoose from "mongoose";

const { Schema } = mongoose;

const courseSchema = new Schema({
  title: { type: String, required: true },
  subTitle: { type: String, required: true },
  thumbnail: { type: String, required: true, },
  description: { type: String, required: true },
  fees: { type: Number, required: true },
  courseDuration: { type: Number, required: true },
  courseTimming: { type: String },
  courseLevel: { type: String, default: "Beginner", enum: ['Beginner', 'Intermediate', 'Advanced'] },
  batch: { type: String },
  teacher: { type: mongoose.Schema.Types.ObjectID, ref: "Users" },
  students: [{ type: mongoose.Schema.Types.ObjectID, ref: "Users" }],
  activeDate: { type: String },
  endDate: { type: String },
},
  {
    timestamps: true,
  },
);

export const courseModel = mongoose.model("Course", courseSchema);
