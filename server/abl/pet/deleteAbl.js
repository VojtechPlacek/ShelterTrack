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

async function DeleteAbl(req, res) {
  try {
    // get request query or body
    const reqParams = req.body;

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

    // get pet to know which shelter to update
    const pet = pet_Dao.get(reqParams.id);
    if (!pet) {
      res.status(404).json({
        code: "petNotFound",
        message: `Pet with id ${reqParams.id} not found`,
      });
      return;
    }

    // remove pet from persistent storage
    pet_Dao.remove(reqParams.id);

    // decrease shelter occupancy
    try {
      const shelter = shelter_Dao.get(pet.shelterId);
      if (shelter && shelter.occupancy > 0) {
        shelter_Dao.update({
          id: shelter.id,
          occupancy: shelter.occupancy - 1,
        });
      }
    } catch (e) {
      // log error but don't fail the pet deletion
      console.error("Failed to update shelter occupancy after pet deletion:", e);
    }

    // return properly filled dtoOut
    res.json({});
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = DeleteAbl;
