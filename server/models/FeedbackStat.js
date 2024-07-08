import mongoose from "mongoose";

const FeedbackStatSchema = new mongoose.Schema(
    {
        productId: String,
        yearlySalesTotal: Number,
        yearlyTotalSoldUnits: Number,
        year: Number,
        monthlyData: [
            {
                month: String,
                totalSales: Number,
                totalUnits: Number
            }
        ],
        dailyData: [
            {
                date: String,
                totalSales: Number,
                totalUnits: Number
            }
        ],
    },
    {timestamps: true}
);

const FeedbackStat = mongoose.model("FeedbackStat", FeedbackStatSchema);
export default FeedbackStat;