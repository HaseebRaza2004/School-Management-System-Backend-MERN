import express from "express"
const router = express.Router(); 

const Request = require('../models/Request.js'); 
const User = require('../models/Users.js'); 


// Submit a request to become a teacher
router.post('/apply', async (req, res) => {
  const { userId } = req.body;

  try {
    const existingRequest = await Request.findOne({ userId, status: 'pending' });
    if (existingRequest) {
      return res.status(400).json({ message: 'You already have a pending request.' });
    }

    const newRequest = new Request({ userId });
    await newRequest.save();

    res.status(201).json({ message: 'Request submitted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get all requests for admin
router.get('/routes/Requests.js', async (req, res) => {
  try {
    const requests = await Request.find().populate('userId', 'name email');
    res.status(200).json(requests);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Approve or reject a request
router.patch('/routes/Requests.js', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['approved', 'rejected'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status.' });
  }

  try {
    const request = await Request.findByIdAndUpdate(id, { status }, { new: true });

    if (!request) {
      return res.status(404).json({ message: 'Request not found.' });
    }

    // Update user role if approved
    if (status === 'approved') {
      await User.findByIdAndUpdate(request.userId, { role: 'teacher' });
    }

    res.status(200).json({ message: `Request ${status} successfully.` });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

export default router;