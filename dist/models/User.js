"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function(mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_unique_validator_1 = __importDefault(
  require("mongoose-unique-validator")
);
const userSchema = new mongoose_1.default.Schema({
  username: {
    type: String,
    lowercase: true,
    unique: true,
    match: [/^[a-zA-Z0-9]+$/, "is invalid"],
    index: true
  },
  email: {
    type: String,
    lowercase: true,
    unique: true,
    required: [true, "can't be blank"],
    match: [/\S+@\S+\.\S+/, "is invalid"],
    index: true
  },
  password: {
    type: String,
    required: [true, "can't be blank"],
    index: true
  },
  name: {
    type: String,
    index: true
  },
  role: {
    type: String,
    required: [true, "can't be blank"],
    match: [/^(hr|vendor)$/, "is invalid"]
  }
});
userSchema.plugin(mongoose_unique_validator_1.default, {
  message: "is already taken"
});
mongoose_1.default.model("User", userSchema);
//# sourceMappingURL=User.js.map
