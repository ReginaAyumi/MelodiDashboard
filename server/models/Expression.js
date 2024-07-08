import mongoose from "mongoose";

const ExpressionDailySchema = new mongoose.Schema(
    {   
        marah: Number,
        risih: Number,
        takut: Number,
        senyum: Number,
        netral: Number,
        sedih: Number,
        terkejut: Number,
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

const ExpressionMinSchema = new mongoose.Schema(
    {   
        marah: Number,
        risih: Number,
        takut: Number,
        senyum: Number,
        netral: Number,
        sedih: Number,
        terkejut: Number,
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

const ExpressionWeeklySchema = new mongoose.Schema(
    {   
        marah: Number,
        risih: Number,
        takut: Number,
        senyum: Number,
        netral: Number,
        sedih: Number,
        terkejut: Number,
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

export const Expression_Daily = mongoose.model("ExpressionDaily", ExpressionDailySchema);
export const Expression_Min = mongoose.model("ExpressionMinute", ExpressionMinSchema);
export const Expression_Week = mongoose.model("ExpressionWeek", ExpressionWeeklySchema);