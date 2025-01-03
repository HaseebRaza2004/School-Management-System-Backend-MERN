import mongoose from 'mongoose';

const { Schema } = mongoose;

const requestSchema = new Schema({
  userId: { type: mongoose.Types.ObjectId, ref: 'Users', required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  contact: { type: String },
  education: { type: String },
  specialistSubject: { type: String },
  workExperience: { type: String },
  skills: { type: String },
},
  {
    timestamps: true,
  },
);

export const RequestModel = mongoose.model('Request', requestSchema);