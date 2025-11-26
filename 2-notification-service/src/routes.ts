import express, { Request, Response, Router } from "express";
import { StatusCodes } from "http-status-codes";
const router: Router = express.Router();
router.get("/notification-health", (req: Request, res: Response) => {
  res.status(StatusCodes.OK).send("Notification service is healthy and OK.");
});
export { router as healthRoutes };
