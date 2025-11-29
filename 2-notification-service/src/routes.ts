// 1. شيلنا كلمة express من هنا، واستدعينا Router مباشرة
import { Request, Response, Router } from "express"; 
import { StatusCodes } from "http-status-codes";

// 2. استخدمنا Router() علطول من غير express.
const router: Router = Router();

router.get("/notification-health", (req: Request, res: Response) => {
  res.status(StatusCodes.OK).send("Notification service is healthy and OK.");
});

export { router as healthRoutes };