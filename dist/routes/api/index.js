"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function(mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
// custom func
const responseCode_1 = __importDefault(require("../../config/responseCode"));
const router = express_1.Router();
router.get("/test", (req, res) => {
  return res.status(responseCode_1.default.ok.code).json({
    message: "Welcome to API",
    success: true
  });
});
exports.default = router;
//# sourceMappingURL=index.js.map
