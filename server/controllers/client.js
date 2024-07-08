import Feedback from "../models/Feedback.js";
import FeedbackStat from "../models/FeedbackStat.js";

export const getFeedbacks = async (req, res) => {
    try {
      const feedbacks = await Feedback.find();

      const feedbackwithStats = await Promise.all(
        feedbacks.map(async (feedback) => {
            const stat = await FeedbackStat.find({
                feedbackId: feedback._id
            })
            return {
                ...feedback._doc,
                stat,
            };
        })
      );

      res.status(200).json(feedbackwithStats);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  };
  