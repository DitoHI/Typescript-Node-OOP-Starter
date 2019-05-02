import mongoose from "mongoose";

// import function
import responseCode from "../../config/response_code";

class Api {
  protected modelName: string;
  protected model: any;
  private populate: string;
  private select: string;
  private unselect: string;

  constructor(
    modelName: string,
    populate?: string,
    select?: string,
    unselect?: string
  ) {
    this.modelName = modelName;
    this.model = mongoose.model(modelName);
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

  protected create(body: any) {
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
        .then((result: any) => {
          return resolve(result);
        })
        .catch((err: any) => {
          return reject(err.message || `Failed to create ${this.modelName}`);
        });
    });
  }

  protected get(body: any, query?: any) {
    return new Promise((resolve, reject) => {
      const bodyClone = Object.assign({}, body);
      const queryClone = Object.assign({}, query);

      const sort: any = {};
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
              !mongoose.Types.ObjectId.isValid(value)
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
        .then((result: any[]) => {
          if (!result || result.length === 0) {
            return reject(`${this.modelName} not found`);
          }
          return resolve(result);
        })
        .catch((err: any) => {
          return reject(err.message || `Failed to get ${this.modelName}`);
        });
    });
  }

  protected find(params: any) {
    return new Promise((resolve, reject) => {
      const paramsClone = Object.assign({}, params);
      let { _id: idParams } = paramsClone;
      if (idParams) {
        if (!mongoose.Types.ObjectId.isValid(idParams)) {
          return reject(`The Id of ${this.modelName} is not valid`);
        }
        paramsClone["_id"] = mongoose.Types.ObjectId(idParams);
      }

      return this.model
        .findOne(paramsClone)
        .select(`${this.select} || ${this.unselect}`)
        .populate(this.populate || "")
        .exec()
        .then((result: any) => {
          if (!result) {
            return reject(`No ${this.modelName} found`);
          }
          return resolve(result);
        })
        .catch((err: any) => {
          return reject(err.message || responseCode.badRequest.message);
        });
    });
  }

  protected update(params: any, body: any) {
    return new Promise((resolve, reject) => {
      const paramsClone = Object.assign({}, params);
      const bodyClone = Object.assign({}, body);
      const bodyKeys = Object.keys(bodyClone);

      const { id: idParams } = paramsClone;
      if (!idParams) {
        return reject(`No ${this.modelName}'s Id in params`);
      }

      if (!mongoose.Types.ObjectId.isValid(idParams)) {
        return reject("The Id is not valid");
      }

      return this.model
        .findByIdAndUpdate(idParams, bodyClone, { new: true })
        .populate(this.populate || "")
        .exec()
        .then((result: any) => {
          if (!result) {
            return reject(`Failed update ${this.modelName}`);
          }
          return resolve(result);
        })
        .catch((err: any) => {
          return reject(err.message || `Failed update ${this.modelName}`);
        });
    });
  }

  protected delete(params: any) {
    return new Promise((resolve, reject) => {
      const paramsClone = Object.assign({}, params);
      const { id: idParams } = paramsClone;
      if (!idParams) {
        return reject(`No ${this.modelName}'s Id not exist in params`);
      }

      if (!mongoose.Types.ObjectId.isValid(idParams)) {
        return reject(`${this.modelName} Id is not valid`);
      }

      return this.model
        .findBydIdAndRemove(idParams)
        .populate(this.populate || "")
        .exec()
        .then((result: any) => {
          return resolve(result);
        })
        .catch((err: any) => {
          return reject(err.message || `Failed to delete ${this.modelName}`);
        });
    });
  }
}

export default Api;
