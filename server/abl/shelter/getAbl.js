const Ajv = require("ajv");
const ajv = new Ajv();

const shelter_Dao = require("../../dao/shelter_Dao.js");
const pet_Dao = require("../../dao/pet_Dao.js");

const schema = {
  type: "object",
  properties: {
    id: { type: "string" },
  },
  required: ["id"],
  additionalProperties: false,
};

async function GetAbl(req, res) {
  try {
    // get request query or body
    const reqParams = req.query?.id ? req.query : req.body;

    // validate input
    const valid = ajv.validate(schema, reqParams);
    if (!valid) {
      res.status(400).json({
        code: "dtoInIsNotValid",
        message: "dtoIn is not valid",
        validationError: ajv.errors,
      });
      return;
    }

    // read shelter by given id
    const shelter = shelter_Dao.get(reqParams.id);
    if (!shelter) {
      res.status(404).json({
        code: "shelterNotFound",
        message: `Shelter with id ${reqParams.id} not found`,
      });
      return;
    }

    // get pets in this shelter
    const petList = pet_Dao.listByShelterId(reqParams.id);
    shelter.pets = petList;

    // return properly filled dtoOut
    res.json(shelter);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = GetAbl;
