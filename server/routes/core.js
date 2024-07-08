import express from 'express';
import Visitor from '../models/Visitor.js'; // Pastikan jalur ini benar
import { Race_Daily, Race_Min, Race_Week } from '../models/Race.js';

const router = express.Router();

// Route untuk mendapatkan detail usia
router.get('/age-details', async (req, res) => {
  try {
    const ages = await Visitor.aggregate([
      { $group: { _id: '$ageGroup', count: { $sum: 1 } } },
      { $project: { _id: 0, ageGroup: '$_id', count: 1 } },
    ]);
    res.status(200).json(ages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
