// List shelters with sorting and filtering support
const shelter_Dao = require("../../dao/shelter_Dao.js");
const pet_Dao = require("../../dao/pet_Dao.js");

async function ListAbl(req, res) {
  try {
    let shelterList = shelter_Dao.list();

    // Apply filters from query parameters
    if (req.query.full === "true") {
      // Filter to only shelters at capacity
      shelterList = shelterList.filter(
        (shelter) => shelter.occupancy >= shelter.capacity
      );
    } else if (req.query.full === "false") {
      // Filter to only shelters with available space
      shelterList = shelterList.filter(
        (shelter) => shelter.occupancy < shelter.capacity
      );
    }

    // Apply search across name, phone, and address
    if (req.query.search) {
      const searchValue = req.query.search.toLowerCase();
      shelterList = shelterList.filter((shelter) => {
        return (
          shelter.name.toLowerCase().includes(searchValue) ||
          shelter.phone.toLowerCase().includes(searchValue) ||
          shelter.address.toLowerCase().includes(searchValue)
        );
      });
    }

    // Apply sorting
    if (req.query.sort) {
      const order = req.query.order === "desc" ? -1 : 1;
      shelterList.sort((a, b) => {
        const fieldA = a[req.query.sort];
        const fieldB = b[req.query.sort];

        if (typeof fieldA === "string") {
          return fieldA.localeCompare(fieldB) * order;
        }
        return (fieldA - fieldB) * order;
      });
    }

    // Get all pets and organize by shelter
    const allPets = pet_Dao.list();
    const petsByShelterId = {};
    allPets.forEach((pet) => {
      if (!petsByShelterId[pet.shelterId]) {
        petsByShelterId[pet.shelterId] = [];
      }
      petsByShelterId[pet.shelterId].push(pet);
    });

    // Add pets to each shelter
    const sheltersWithPets = shelterList.map((shelter) => ({
      ...shelter,
      pets: petsByShelterId[shelter.id] || [],
    }));

    res.json({ itemList: sheltersWithPets, petsByShelterId });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = ListAbl;
