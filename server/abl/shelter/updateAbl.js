const Ajv = require("ajv");
const ajv = new Ajv();

const shelter_Dao = require("../../dao/shelter_Dao.js");

const schema = {
  type: "object",
  properties: {
    id: { type: "string" },
    name: { type: "string" },
    occupancy: { type: "number" },
    capacity: { type: "number" },
    phone: { type: "string" },
    address: { type: "string", maxLength: 100 },
  },
  required: ["id"],
  additionalProperties: false,
};

async function UpdateAbl(req, res) {
  try {
    let shelter = req.body;

    // validate input
    const valid = ajv.validate(schema, shelter);
    if (!valid) {
      res.status(400).json({
        code: "dtoInIsNotValid",
        message: "dtoIn is not valid",
        validationError: ajv.errors,
      });
      return;
    }

    // get current shelter for validation
    const currentShelter = shelter_Dao.get(shelter.id);
    if (!currentShelter) {
      res.status(404).json({
        code: "shelterNotFound",
        message: `Shelter with id ${shelter.id} not found`,
      });
      return;
    }

    // validate capacity changes
    if (shelter.capacity !== undefined && shelter.capacity < currentShelter.occupancy) {
      res.status(400).json({
        code: "capacityTooLow",
        message: `Cannot reduce capacity to ${shelter.capacity}. Shelter currently has ${currentShelter.occupancy} pets.`,
      });
      return;
    }

    // validate occupancy changes
    if (shelter.occupancy !== undefined) {
      if (shelter.occupancy < 0) {
        res.status(400).json({
          code: "invalidOccupancy",
          message: "Occupancy cannot be negative",
        });
        return;
      }

      const capacity = shelter.capacity !== undefined ? shelter.capacity : currentShelter.capacity;
      if (shelter.occupancy > capacity) {
        res.status(400).json({
          code: "occupancyExceedsCapacity",
          message: `Occupancy (${shelter.occupancy}) cannot exceed capacity (${capacity})`,
        });
        return;
      }
    }

    // update shelter in persistent storage
    let updatedShelter;
    try {
      updatedShelter = shelter_Dao.update(shelter);
    } catch (e) {
      res.status(400).json({
        code: e.code || "failedToUpdateShelter",
        message: e.message,
      });
      return;
    }

    if (!updatedShelter) {
      res.status(404).json({
        code: "shelterNotFound",
        message: `Shelter with id ${shelter.id} not found`,
      });
      return;
    }

    // return properly filled dtoOut
    res.json(updatedShelter);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = UpdateAbl;
