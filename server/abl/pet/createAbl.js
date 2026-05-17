// Business Logic Layer for creating pets with capacity validation
const Ajv = require("ajv");
const ajv = new Ajv();

const pet_Dao = require("../../dao/pet_Dao.js");
const shelter_Dao = require("../../dao/shelter_Dao.js");

// JSON schema for pet validation
const petSchema = {
  type: "object",
  properties: {
    name: { type: "string", maxLength: 50 },
    species: { type: "string", maxLength: 50 },
    age: { type: "number" },
    status: { type: "string", maxLength: 100 },
    shelterId: { type: "string" },
  },
  required: ["name", "species", "age", "status", "shelterId"],
  additionalProperties: false,
};

async function CreateAbl(req, res) {
  try {
    let pet = req.body;

    // Validate input data against schema
    const valid = ajv.validate(petSchema, pet);
    if (!valid) {
      res.status(400).json({
        code: "dtoInIsNotValid",
        message: "dtoIn is not valid",
        validationError: ajv.errors,
      });
      return;
    }

    // Verify shelter exists
    const shelter = shelter_Dao.get(pet.shelterId);
    if (!shelter) {
      res.status(400).json({
        code: "shelterDoesNotExist",
        message: `shelter with id ${pet.shelterId} does not exist`,
      });
      return;
    }

    // check if shelter has capacity for another pet
    if (shelter.occupancy >= shelter.capacity) {
      res.status(400).json({
        code: "shelterAtCapacity",
        message: `Shelter "${shelter.name}" is at full capacity (${shelter.capacity}). Cannot add more pets.`,
      });
      return;
    }

    // store pet to persistent storage
    try {
      pet = pet_Dao.create(pet);
    } catch (e) {
      res.status(400).json({
        code: e.code || "failedToCreatePet",
        message: e.message,
      });
      return;
    }

    // increase shelter occupancy
    try {
      const updatedShelter = shelter_Dao.update({
        id: shelter.id,
        occupancy: shelter.occupancy + 1,
      });
      if (!updatedShelter) {
        // rollback pet creation if shelter update fails
        pet_Dao.remove(pet.id);
        res.status(500).json({
          code: "failedToUpdateShelterOccupancy",
          message: "Pet created but failed to update shelter occupancy",
        });
        return;
      }
      pet.shelter = updatedShelter;
    } catch (e) {
      // rollback pet creation if shelter update fails
      pet_Dao.remove(pet.id);
      res.status(500).json({
        code: "failedToUpdateShelterOccupancy",
        message: e.message,
      });
      return;
    }

    pet.shelter = shelter;

    // return properly filled dtoOut
    res.json(pet);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = CreateAbl;
