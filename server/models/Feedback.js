import mongoose from "mongoose";

const FeedbackSchema = new mongoose.Schema(
    {
        feedbackId: String,
        feedbackDate: String,
        feedbackContent: String,
        rating: Number,
        visitorId: String,
    },
    {timestamps: true}
);

const Feedback = mongoose.model("Feedback", FeedbackSchema);
export default Feedback;