import { Router, type IRouter } from "express";
import healthRouter from "./health";
import anthropicRouter from "./anthropic";
import dailyQuestionRouter from "./daily-question";
import journalRouter from "./journal";
import newsletterRouter from "./newsletter";
import redditRouter from "./reddit";

const router: IRouter = Router();

router.use(healthRouter);
router.use(anthropicRouter);
router.use(dailyQuestionRouter);
router.use(journalRouter);
router.use(newsletterRouter);
router.use(redditRouter);

export default router;
