import express from "express";
import { getFeedbacks } from "../controllers/client.js";
import { getVisitor } from "../controllers/general.js";

const router = express.Router();

router.get("/feedbacks", getFeedbacks)

export default router;
