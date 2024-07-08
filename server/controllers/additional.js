import Feedback from "../models/Feedback.js";
import Visitor from "../models/Visitor.js";

export const getFeedbacks = async (req, res) => {
    try {
      const feedbacks = await Feedback.find();

      const visitors = await Promise.all(
        feedbacks.map(async (feedback) => {
            const stat = await Visitor.find({
                feedbackId: feedback.feedBackId
            })
            return {
                ...feedback._doc,
                stat,
            };
        })
      );

      res.status(200).json(visitors);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  };
  