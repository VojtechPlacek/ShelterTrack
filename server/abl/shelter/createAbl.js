const Ajv = require("ajv");
const ajv = new Ajv();

const shelter_Dao = require("../../dao/shelter_Dao.js");

const shelterSchema = {
  type: "object",
  properties: {
    name: { type: "string", maxLength: 100 },
    occupancy: { type: "number" },
    capacity: { type: "number" },
    phone: { type: "string", maxLength: 20 },
    address: { type: "string", maxLength: 100 },
  },
  required: ["name", "occupancy", "capacity", "phone", "address"],
  additionalProperties: false,
};

async function CreateAbl(req, res) {
  try {
    let shelter = req.body;

    // validate input
    const valid = ajv.validate(shelterSchema, shelter);
    if (!valid) {
      res.status(400).json({
        code: "dtoInIsNotValid",
        message: "dtoIn is not valid",
        validationError: ajv.errors,
      });
      return;
    }

    // store shelter to persistent storage
    try {
      shelter = shelter_Dao.create(shelter);
    } catch (e) {
      res.status(400).json({
        code: e.code || "failedToCreateShelter",
        message: e.message,
      });
      return;
    }

    // return properly filled dtoOut
    res.json(shelter);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = CreateAbl;
