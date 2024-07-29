import express from "express";
import { getFeedbacks } from "../controllers/additional.js";
import { getClickStream } from "../controllers/additional.js";
import { getVisitor } from "../controllers/general.js";

const router = express.Router();

router.get("/feedbacks", getFeedbacks);

router.get("/click_stream", getClickStream);

export default router;
