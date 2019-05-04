import mongoose from "mongoose";

export default {
  init: () => {
    mongoose.set("useNewUrlParser", true);
    mongoose.set("useFindAndModify", false);
    mongoose.set("useCreateIndex", true);

    switch (process.env.NODE_ENV) {
      case "development": {
        const mongodbUri = "mongodb://localhost:27017/mhctest";
        mongoose
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
        mongoose.connect(mongodbUri, {
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
