
import mongoose from 'mongoose'

const { Schema } = mongoose



const requestSchema = new Schema({
  userId: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const RequestModel = mongoose.model('Request', requestSchema);
