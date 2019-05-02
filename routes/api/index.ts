import { Router } from "express";

// custom func
import responseCode from "../../config/response_code";

const router = Router();
router.get("/test", (req, res) => {
  return res.status(responseCode.ok.code).json({
    message: "Welcome to API",
    success: true
  });
});

export default router;
