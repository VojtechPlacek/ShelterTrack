const Ajv = require("ajv");
const ajv = new Ajv();

const pet_Dao = require("../../dao/pet_Dao.js");
const shelter_Dao = require("../../dao/shelter_Dao.js");

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

    // read pet by given id
    const pet = pet_Dao.get(reqParams.id);
    if (!pet) {
      res.status(404).json({
        code: "petNotFound",
        message: `Pet with id ${reqParams.id} not found`,
      });
      return;
    }

    // get related shelter
    const shelter = shelter_Dao.get(pet.shelterId);
    pet.shelter = shelter;

    // return properly filled dtoOut
    res.json(pet);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = GetAbl;
