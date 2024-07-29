import mongoose from "mongoose";

const clickStreamSchema = new mongoose.Schema({
    VisitorId: { type: String, required: true },
    clicks: [
        {
            visited_url: { type: String, required: true },
            clickDate: { type: Date, default: Date.now }
        }
    ],
    clickstreamId: String,
});

// Buat model ClickStream dari schema
const ClickStream = mongoose.model('ClickStream', clickStreamSchema);

export default ClickStream;