// Express router for pet API endpoints
const express = require("express");
const router = express.Router();

// Import business logic handlers
const GetAbl = require("../abl/pet/getAbl");
const ListAbl = require("../abl/pet/listAbl");
const CreateAbl = require("../abl/pet/createAbl");
const UpdateAbl = require("../abl/pet/updateAbl");
const DeleteAbl = require("../abl/pet/deleteAbl");

// Define API routes
router.get("/get", GetAbl);
router.get("/list", ListAbl);
router.post("/create", CreateAbl);
router.post("/update", UpdateAbl);
router.post("/delete", DeleteAbl);

module.exports = router;