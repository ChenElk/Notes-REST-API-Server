import express from "express";
import { completeWithAi } from "../controllers/aiController";
import { authentication } from "../middlewares/authentication";

const router = express.Router();

router.post("/complete", authentication, completeWithAi);

export default router;