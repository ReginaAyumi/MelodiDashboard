import mongoose from "mongoose";

const faceAnalyticsSchema = new mongoose.Schema({
  timestamp: {
    type: Date,
    default: Date.now,
  },
  age: {
    value: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      enum: ['anak', 'remaja', 'dewasa', 'lansia'],
      required: true,
    },
  },
  gender: {
    type: String,
    enum: ['laki-laki', 'perempuan'],
    required: true,
  },
  expression: {
    type: String,
    enum: ['marah', 'risih', 'takut', 'senyum', 'netral', 'sedih', 'terkejut'],
    required: true,
  },
});

const FaceAnalytics = mongoose.model('FaceAnalytics', faceAnalyticsSchema);
//module.exports = FaceAnalytics;
export default FaceAnalytics;
