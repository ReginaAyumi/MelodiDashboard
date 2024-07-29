import Feedback from "../models/Feedback.js";
import ClickStream from "../models/ClickStream.js";
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

  export const getClickStream = async (req, res) => {
    try {
      const click_stream = await ClickStream.find();

      const visitors = await Promise.all(
        click_stream.map(async (clickstream) => {
            const stat = await Visitor.find({
                clickstreamId: clickstream.clickStreamId
            })
            return {
                ...clickstream._doc,
                stat,
            };
        })
      );

      res.status(200).json(visitors);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  };

//   export const getClickStream = async (req, res) => {
//     try {
//       const { clickstreamId } = req.params;
//       const clickstream = await ClickStream.findById(clickstreamId);
//       if (!clickstream) {
//         return res.status(404).json({ message: "data ClickStream not found" });
//       }
//       res.status(200).json(clickstream);
//     } catch (error) {
//       res.status(500).json({ message: error.message });
//     }
// };
  