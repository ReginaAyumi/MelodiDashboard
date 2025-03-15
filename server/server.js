import express from "express";
import connectDB from "./config/db.js"
import FaceAnalytics from "./models/FaceAnalytics.js"
// const FaceAnalytics = require('./models/FaceAnalytics');

const app = express();
app.use(express.json());

// Connect to MongoDB
connectDB();

// Fungsi untuk menambahkan data
const categorizeAge = (age) => {
    if (age >= 1 && age <= 11) return 'anak';
    if (age >= 12 && age <= 18) return 'remaja';
    if (age >= 19 && age <= 59) return 'dewasa';
    return 'lansia';
};

const addFaceData = async (ageValue, gender, expression) => {
    const ageCategory = categorizeAge(ageValue);

    const data = new FaceAnalytics({
        age: {
        value: ageValue,
        category: ageCategory,
        },
        gender: gender,
        expression: expression,
    });
    await data.save();
    console.log('Data berhasil disimpan:', data);
};

// Test route untuk menambahkan data
app.get('/add-sample-data', async (req, res) => {
    await addFaceData(25, 'laki-laki', 'senyum');
    res.send('Sample data added');
  });
  
  // Start server
  const PORT = process.env.PORT || 5001;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

export default app;