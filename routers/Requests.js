import express from "express"
import { RequestModel } from "../models/Request.js";
import { UserModel } from "../models/Users.js";

const router = express.Router();

// Submit a request to become a teacher
router.post('/apply', async (req, res) => {
  const { userId } = req.body;
  try {
    const existingRequest = await RequestModel.findOne({ userId, status: 'pending' });
    if (existingRequest) {
      return res.status(400).json({ message: 'You already have a pending request.' });
    }

    const newRequest = new RequestModel(req.body);
    await newRequest.save();

    res.status(201).json({ message: 'Request submitted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get all requests for admin
router.get('/', async (req, res) => {
  try {
    const requests = await RequestModel.find().populate('userId');
    res.status(200).json(requests);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Approve or reject a request
router.patch('/routes/Requests/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['approved', 'rejected'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status.' });
  }

  try {
    let request;

    if (status === 'approved') {
      request = await RequestModel.findByIdAndUpdate(id, { status }, { new: true });

      if (!request) {
        return res.status(404).json({ message: 'Request not found.' });
      }

      await UserModel.findByIdAndUpdate(request.userId, { role: 'teacher' });
    } else if (status === 'rejected') {
      // Delete the request
      request = await RequestModel.findByIdAndDelete(id);

      if (!request) {
        return res.status(404).json({ message: 'Request not found.' });
      }

      // Check if the user role is already 'teacher'
      const user = await UserModel.findById(request.userId);
      if (user && user.role === 'teacher') {
        // Update user role to 'student'
        await UserModel.findByIdAndUpdate(request.userId, { role: 'student' });
      }
    }

    res.status(200).json({ message: `Request ${status} successfully.` });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get all approve teachers
router.get("/teachers", async (req, res) => {
  try {
    let teachers = await RequestModel.find({ status: 'approved' }).populate('userId');
    res.status(200).json({
      error: false,
      teachers: teachers,
      message: "All Teachers fetched successfully",
    });
  } catch (error) {
    res.status(404).json({
      error: true,
      message: "Failed to fetch Teachers",
    });
  }
});

export default router;