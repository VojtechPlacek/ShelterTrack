const Ajv = require("ajv");
const ajv = new Ajv();

const pet_Dao = require("../../dao/pet_Dao.js");
const shelter_Dao = require("../../dao/shelter_Dao.js");

const schema = {
  type: "object",
  properties: {
    id: { type: "string" },
    name: { type: "string", maxLength: 50 },
    species: { type: "string", maxLength: 50 },
    age: { type: "number" },
    status: { type: "string", maxLength: 100 },
    shelterId: { type: "string" },
  },
  required: ["id"],
  additionalProperties: false,
};

async function UpdateAbl(req, res) {
  try {
    let pet = req.body;

    // validate input
    const valid = ajv.validate(schema, pet);
    if (!valid) {
      res.status(400).json({
        code: "dtoInIsNotValid",
        message: "dtoIn is not valid",
        validationError: ajv.errors,
      });
      return;
    }

    // get current pet to check for shelter changes
    const currentPet = pet_Dao.get(pet.id);
    if (!currentPet) {
      res.status(404).json({
        code: "petNotFound",
        message: `Pet with id ${pet.id} not found`,
      });
      return;
    }

    // if shelterId is being changed, verify new shelter exists and has capacity
    if (pet.shelterId && pet.shelterId !== currentPet.shelterId) {
      const newShelter = shelter_Dao.get(pet.shelterId);
      if (!newShelter) {
        res.status(400).json({
          code: "shelterDoesNotExist",
          message: `shelter with id ${pet.shelterId} does not exist`,
        });
        return;
      }

      // check if new shelter has capacity
      if (newShelter.occupancy >= newShelter.capacity) {
        res.status(400).json({
          code: "shelterAtCapacity",
          message: `Shelter "${newShelter.name}" is at full capacity (${newShelter.capacity}). Cannot move pet there.`,
        });
        return;
      }
    }

    // update pet in persistent storage
    let updatedPet;
    try {
      updatedPet = pet_Dao.update(pet);
    } catch (e) {
      res.status(400).json({
        code: "failedToUpdatePet",
        message: e.message,
      });
      return;
    }

    if (!updatedPet) {
      res.status(404).json({
        code: "petNotFound",
        message: `Pet with id ${pet.id} not found`,
      });
      return;
    }

    // handle shelter occupancy changes
    if (pet.shelterId && pet.shelterId !== currentPet.shelterId) {
      try {
        // decrease occupancy in old shelter
        const oldShelter = shelter_Dao.get(currentPet.shelterId);
        if (oldShelter && oldShelter.occupancy > 0) {
          shelter_Dao.update({
            id: oldShelter.id,
            occupancy: oldShelter.occupancy - 1,
          });
        }

        // increase occupancy in new shelter
        const newShelter = shelter_Dao.get(pet.shelterId);
        if (newShelter) {
          shelter_Dao.update({
            id: newShelter.id,
            occupancy: newShelter.occupancy + 1,
          });
        }
      } catch (e) {
        // rollback pet update if shelter occupancy update fails
        pet_Dao.update(currentPet);
        res.status(500).json({
          code: "failedToUpdateShelterOccupancy",
          message: "Pet updated but failed to update shelter occupancy: " + e.message,
        });
        return;
      }
    }

    // get related shelter for response
    const shelter = shelter_Dao.get(updatedPet.shelterId);
    updatedPet.shelter = shelter;

    // return properly filled dtoOut
    res.json(updatedPet);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = UpdateAbl;
