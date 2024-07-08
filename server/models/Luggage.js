import mongoose from "mongoose";

const LuggageDailySchema = new mongoose.Schema(
  {
    manusia: Number,
    besar: Number,
    sedang: Number,
    kecil: Number,
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

const LuggageMinSchema = new mongoose.Schema(
  {
    manusia: Number,
    besar: Number,
    sedang: Number,
    kecil: Number,
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

const LuggageWeeklySchema = new mongoose.Schema(
  {
    manusia: Number,
    besar: Number,
    sedang: Number,
    kecil: Number,
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

export const Luggage_Daily = mongoose.model("LuggageDaily", LuggageDailySchema);
export const Luggage_Min = mongoose.model("LuggageMinute", LuggageMinSchema);
export const Luggage_Week = mongoose.model("LuggageWeek", LuggageWeeklySchema);
