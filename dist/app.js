"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function(mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
var __importStar =
  (this && this.__importStar) ||
  function(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null)
      for (var k in mod)
        if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
  };
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv = __importStar(require("dotenv"));
const errorhandler = require("errorhandler");
// custom func
const responseCode_1 = __importDefault(require("./config/responseCode"));
const routes_1 = __importDefault(require("./routes"));
const db_1 = __importDefault(require("./config/db"));
dotenv.config();
// check if the project is in production or not
const isProduction = process.env.NODE_ENV === "production";
const app = express_1.default();
app.use(cors_1.default());
app.use(express_1.default.json());
if (!isProduction) {
  app.use(errorhandler());
}
db_1.default.init();
app.use(routes_1.default);
// catch any 404
app.use((req, res) => {
  const error = {
    message: "Page not found",
    status: responseCode_1.default.badRequest.code
  };
  res.status(error.status).json({
    message: error.message || responseCode_1.default.serverError.message,
    success: false
  });
});
const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, () => {
  if (!isProduction) {
    console.log(`Server listen at PORT ${PORT}`);
  }
});
exports.default = {
  app,
  server
};
//# sourceMappingURL=app.js.map
