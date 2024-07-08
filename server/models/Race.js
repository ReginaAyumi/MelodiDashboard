import mongoose from "mongoose";

const RaceDailySchema = new mongoose.Schema(
  {
    negroid: Number,
    east_asian: Number,
    indian: Number,
    latin: Number,
    middle_eastern: Number,
    south_east_asian: Number,
    kaukasia: Number,
    number: {
      type: Number,
      validate: {
        validator: Number.isInteger,
        message: "{VALUE} is not an integer value",
      },
    },
    tanggal: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const RaceMinSchema = new mongoose.Schema(
  {
    negroid: Number,
    east_asian: Number,
    indian: Number,
    latin: Number,
    middle_eastern: Number,
    south_east_asian: Number,
    kaukasia: Number,
    number: {
      type: Number,
      validate: {
        validator: Number.isInteger,
        message: "{VALUE} is not an integer value",
      },
    },
    minute: Number,
  },
  { timestamps: true }
);

const RaceWeeklySchema = new mongoose.Schema(
  {
    negroid: Number,
    east_asian: Number,
    indian: Number,
    latin: Number,
    middle_eastern: Number,
    south_east_asian: Number,
    kaukasia: Number,
    number: {
      type: Number,
      validate: {
        validator: Number.isInteger,
        message: "{VALUE} is not an integer value",
      },
    },
    week: Number,
  },
  { timestamps: true }
);

export const Race_Daily = mongoose.model("RaceDaily", RaceDailySchema);
export const Race_Min = mongoose.model("RaceMinute", RaceMinSchema);
export const Race_Week = mongoose.model("RaceWeek", RaceWeeklySchema);
