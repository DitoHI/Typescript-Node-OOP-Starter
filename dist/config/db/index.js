"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function(mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
exports.default = {
  init: () => {
    mongoose_1.default.set("useNewUrlParser", true);
    mongoose_1.default.set("useFindAndModify", false);
    mongoose_1.default.set("useCreateIndex", true);
    switch (process.env.NODE_ENV) {
      case "development": {
        const mongodbUri = "mongodb://localhost:27017/mhctest";
        mongoose_1.default
          .connect(mongodbUri, {
            useCreateIndex: true,
            useNewUrlParser: true
          })
          .then(() => {
            console.log(`Mongoose connected at ${mongodbUri}`);
          })
          .catch(err => {
            console.log(err.message || `Error in connecting to ${mongodbUri}`);
          });
        break;
      }
      case "production": {
        const mongodbUri = process.env.DB_URI;
        mongoose_1.default.connect(mongodbUri, {
          useCreateIndex: true,
          useNewUrlParser: true
        });
        break;
      }
      default:
        break;
    }
  }
};
//# sourceMappingURL=index.js.map
