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

// import api route
import locationRoutes from "./location";
router.use("/location", locationRoutes);

export default router;
