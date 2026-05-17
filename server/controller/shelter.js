const express = require("express");
const router = express.Router();

const GetAbl = require("../abl/shelter/getAbl");
const ListAbl = require("../abl/shelter/listAbl");
const CreateAbl = require("../abl/shelter/createAbl");
const UpdateAbl = require("../abl/shelter/updateAbl");
const DeleteAbl = require("../abl/shelter/deleteAbl");

router.get("/get", GetAbl);
router.get("/list", ListAbl);
router.post("/create", CreateAbl);
router.post("/update", UpdateAbl);
router.post("/delete", DeleteAbl);

module.exports = router;
