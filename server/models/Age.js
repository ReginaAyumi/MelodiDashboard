import mongoose from "mongoose";

const AgeDailySchema = new mongoose.Schema(
    {
        anak: Number,
        remaja: Number,
        dewasa: Number,
        lansia: Number,
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

const AgeMinSchema = new mongoose.Schema(
    {
        anak: Number,
        remaja: Number,
        dewasa: Number,
        lansia: Number,
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

const AgeWeeklySchema = new mongoose.Schema(
    {
        anak: Number,
        remaja: Number,
        dewasa: Number,
        lansia: Number,
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

export const Age_Daily = mongoose.model("AgeDaily", AgeDailySchema);
export const Age_Min = mongoose.model("AgeMinute", AgeMinSchema);
export const Age_Week = mongoose.model("AgeWeek", AgeWeeklySchema);