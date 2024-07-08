import mongoose from "mongoose";

const GenderDailySchema = new mongoose.Schema(
    {
        pria: Number,
        wanita: Number,
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

const GenderMinSchema = new mongoose.Schema(
    {
        pria: Number,
        wanita: Number,
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

const GenderWeeklySchema = new mongoose.Schema(
    {
        pria: Number,
        wanita: Number,
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

export const Gender_Daily = mongoose.model("GenderDaily", GenderDailySchema);
export const Gender_Min = mongoose.model("GenderMinute", GenderMinSchema);
export const Gender_Week = mongoose.model("GenderWeek", GenderWeeklySchema);