import { Router, type IRouter } from "express";
import { GetDailyQuestionResponse } from "@workspace/api-zod";
import { getDailyQuestion } from "../lib/daily-questions";

const router: IRouter = Router();

router.get("/daily-question", (_req, res) => {
  const data = GetDailyQuestionResponse.parse(getDailyQuestion());
  res.json(data);
});

export default router;
