import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import errorhandler = require("errorhandler");

// custom func
import responseCode from "./config/responseCode";
import { IError } from "./config/publicInterface";
import db from "./config/db";
import "./models/User";
import "./models/Province";
import "./models/District";
import routes from "./routes";

dotenv.config();

// check if the project is in production or not
const isProduction = process.env.NODE_ENV === "production";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

if (!isProduction) {
  app.use(errorhandler());
}

db.init();
app.use(routes);

// catch any 404
app.use((req, res) => {
  const error: IError = {
    message: "Page not found",
    status: responseCode.badRequest.code
  };
  res.status(error.status).json({
    message: error.message || responseCode.serverError.message,
    success: false
  });
});

const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, () => {
  if (!isProduction) {
    console.log(`Server listen at PORT ${PORT}`);
  }
});

export default {
  app,
  server
};
