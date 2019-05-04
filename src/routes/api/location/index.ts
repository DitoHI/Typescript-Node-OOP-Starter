import express from "express";

import LocationApi from "./LocationApi";

const router = express.Router();
const provinceModelName = "Province";
const provinceController = new LocationApi(provinceModelName);

// list of endpoints

router.post("/list_province", provinceController.getListProvince);

export default router;
