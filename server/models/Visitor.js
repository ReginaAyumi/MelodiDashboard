import mongoose from "mongoose";

const VisitorSchema = new mongoose.Schema(
  {
    visitorId: String,
    ageGroup: {
      type: String,
      required: true,
      enum: ["18-25", "26-35", "36-45", "46-55"],
    },
    gender: {
      type: String,
      required: true,
      enum: ["Male", "Female"],
    },
    expression: {
      type: String,
      required: true,
      enum: ["Happy", "Neutral", "Sad", "Surprised", "Angry"],
    },
    race: {
      type: String,
      required: true,
      enum: ["Asian", "Caucasian", "African American", "Hispanic"],
    },
    luggage: {
      type: String,
      required: true,
      enum: ["Small", "Medium", "Large"],
    },
    time: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Visitor = mongoose.model("Visitor", VisitorSchema);
export default Visitor;
