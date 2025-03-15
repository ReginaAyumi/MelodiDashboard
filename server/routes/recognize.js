import express from "express";
import { MongoClient } from "mongodb";
import fetch from "node-fetch";

const router = express.Router();

// Fungsi untuk mengirim frame ke API Flask
const sendFrameToApi = async (frame) => {
    try {
        const response = await fetch("http://127.0.0.1:5000/recognize", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ frame }),
        });
        const result = await response.json();
        console.log("Detections:", result.detections);
    } catch (error) {
        console.error("Error sending frame to API:", error);
    }
};

// Rute untuk menerima frame dari frontend dan meneruskannya ke API Flask
router.post("/recognize", async (req, res) => {
    const { frameData } = req.body;
    if (!frameData) {
        return res.status(400).json({ error: "Frame data is required." });
    }

    try {
        await sendFrameToApi(frameData);
        res.status(200).json({ message: "Frame sent successfully to API." });
    } catch (error) {
        console.error("Error processing frame:", error);
        res.status(500).json({ error: "An error occurred while processing the frame." });
    }
});

export default router;