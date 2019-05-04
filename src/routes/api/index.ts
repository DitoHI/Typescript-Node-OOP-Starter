import { Router } from "express";

// custom func
import responseCode from "../../config/responseCode";

const router = Router();
router.get("/test", (req, res) => {
  return res.status(responseCode.ok.code).json({
    message: "Welcome to API",
    success: true
  });
});

export default router;
