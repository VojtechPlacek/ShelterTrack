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

async function DeleteAbl(req, res) {
  try {
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

    // check there are no pets related to given shelter
    const petList = pet_Dao.listByShelterId(reqParams.id);
    if (petList.length) {
      res.status(400).json({
        code: "shelterWithPets",
        message: "shelter has related pets and cannot be deleted",
        petCount: petList.length,
      });
      return;
    }

    // remove shelter from persistent storage
    shelter_Dao.remove(reqParams.id);

    // return properly filled dtoOut
    res.json({});
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = DeleteAbl;
