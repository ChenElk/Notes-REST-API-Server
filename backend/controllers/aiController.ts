import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/authentication";
import { runAgent } from "../services/agentService";

export const completeWithAi = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { prompt } = req.body;

    if (typeof prompt !== "string" || prompt.trim() === "") {
      return res.status(400).json({ message: "Invalid body" });
    }

    const result = await runAgent({ prompt });

    return res.status(200).json(result);
  } catch (error: any) {
    if (error.status) {
      return res.status(error.status).json({ message: error.message });
    }

    return res.status(500).json({ message: "Internal Server Error" });
  }
};