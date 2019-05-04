"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function(mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
// import function
const responseCode_1 = __importDefault(require("../../config/responseCode"));
class Api {
  constructor(modelName, populate, select, unselect) {
    this.modelName = modelName;
    this.model = mongoose_1.default.model(modelName);
    this.populate = populate;
    this.select = select;
    this.unselect = unselect;
    // binding function
    this.create = this.create.bind(this);
    this.get = this.get.bind(this);
    this.find = this.find.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
  }
  create(body) {
    return new Promise((resolve, reject) => {
      // copy the value of object
      const bodyClone = Object.assign({}, body);
      if (
        Object.entries(bodyClone).length === 0 &&
        bodyClone.constructor === Object
      ) {
        return reject(`${this.modelName} form is not filled properly`);
      }
      const bodyItem = this.model(bodyClone);
      return bodyItem
        .save()
        .then(result => {
          return resolve(result);
        })
        .catch(err => {
          return reject(err.message || `Failed to create ${this.modelName}`);
        });
    });
  }
  get(body, query) {
    return new Promise((resolve, reject) => {
      const bodyClone = Object.assign({}, body);
      const queryClone = Object.assign({}, query);
      const sort = {};
      if (bodyClone) {
        if (
          typeof queryClone.caseInsensitive === "boolean" &&
          queryClone.caseInsensitive
        ) {
          const bodyKeys = Object.keys(bodyClone);
          const bodyValues = Object.values(bodyClone);
          bodyValues.forEach((value, index) => {
            if (
              typeof value === "string" &&
              !mongoose_1.default.Types.ObjectId.isValid(value)
            ) {
              bodyClone[bodyKeys[index]] = { $regex: new RegExp(value, "i") };
            }
          });
        }
        if (queryClone.sortBy) {
          sort[queryClone.sortBy] = queryClone.sortAs
            ? queryClone.sortAs
            : "asc";
        }
      }
      return this.model
        .find(bodyClone)
        .limit(parseInt(queryClone.endAt, 10))
        .skip(parseInt(queryClone.startAt, 10))
        .sort(sort)
        .populate(this.populate || "")
        .select(`${this.select} || ${this.unselect}`)
        .exec()
        .then(result => {
          if (!result || result.length === 0) {
            return reject(`${this.modelName} not found`);
          }
          return resolve(result);
        })
        .catch(err => {
          return reject(err.message || `Failed to get ${this.modelName}`);
        });
    });
  }
  find(params) {
    return new Promise((resolve, reject) => {
      const paramsClone = Object.assign({}, params);
      const { _id: idParams } = paramsClone;
      if (idParams) {
        if (!mongoose_1.default.Types.ObjectId.isValid(idParams)) {
          return reject(`The Id of ${this.modelName} is not valid`);
        }
        paramsClone["_id"] = mongoose_1.default.Types.ObjectId(idParams);
      }
      return this.model
        .findOne(paramsClone)
        .select(`${this.select} || ${this.unselect}`)
        .populate(this.populate || "")
        .exec()
        .then(result => {
          if (!result) {
            return reject(`No ${this.modelName} found`);
          }
          return resolve(result);
        })
        .catch(err => {
          return reject(
            err.message || responseCode_1.default.badRequest.message
          );
        });
    });
  }
  update(params, body) {
    return new Promise((resolve, reject) => {
      const paramsClone = Object.assign({}, params);
      const bodyClone = Object.assign({}, body);
      const bodyKeys = Object.keys(bodyClone);
      const { id: idParams } = paramsClone;
      if (!idParams) {
        return reject(`No ${this.modelName}'s Id in params`);
      }
      if (!mongoose_1.default.Types.ObjectId.isValid(idParams)) {
        return reject("The Id is not valid");
      }
      return this.model
        .findByIdAndUpdate(idParams, bodyClone, { new: true })
        .populate(this.populate || "")
        .exec()
        .then(result => {
          if (!result) {
            return reject(`Failed update ${this.modelName}`);
          }
          return resolve(result);
        })
        .catch(err => {
          return reject(err.message || `Failed update ${this.modelName}`);
        });
    });
  }
  delete(params) {
    return new Promise((resolve, reject) => {
      const paramsClone = Object.assign({}, params);
      const { id: idParams } = paramsClone;
      if (!idParams) {
        return reject(`No ${this.modelName}'s Id not exist in params`);
      }
      if (!mongoose_1.default.Types.ObjectId.isValid(idParams)) {
        return reject(`${this.modelName} Id is not valid`);
      }
      return this.model
        .findBydIdAndRemove(idParams)
        .populate(this.populate || "")
        .exec()
        .then(result => {
          return resolve(result);
        })
        .catch(err => {
          return reject(err.message || `Failed to delete ${this.modelName}`);
        });
    });
  }
}
exports.default = Api;
//# sourceMappingURL=Api.js.map
