// List pets with sorting and filtering support
const pet_Dao = require("../../dao/pet_Dao.js");
const shelter_Dao = require("../../dao/shelter_Dao.js");

async function ListAbl(req, res) {
  try {
    let petList = pet_Dao.list();

    // Apply filters from query parameters
    if (req.query.species) {
      petList = petList.filter(
        (pet) => pet.species.toLowerCase() === req.query.species.toLowerCase()
      );
    }
    if (req.query.status) {
      petList = petList.filter(
        (pet) => pet.status.toLowerCase() === req.query.status.toLowerCase()
      );
    }
    if (req.query.shelterId) {
      petList = petList.filter((pet) => pet.shelterId === req.query.shelterId);
    }

    // Apply search across name, species, status and shelter name
    if (req.query.search) {
      const searchValue = req.query.search.toLowerCase();
      const shelterMap = shelter_Dao.getShelterMap();
      petList = petList.filter((pet) => {
        const shelterName = shelterMap[pet.shelterId]?.name?.toLowerCase() || "";
        return (
          pet.name.toLowerCase().includes(searchValue) ||
          pet.species.toLowerCase().includes(searchValue) ||
          pet.status.toLowerCase().includes(searchValue) ||
          shelterName.includes(searchValue)
        );
      });
    }

    // Apply sorting
    if (req.query.sort) {
      const order = req.query.order === "desc" ? -1 : 1;
      petList.sort((a, b) => {
        const fieldA = a[req.query.sort];
        const fieldB = b[req.query.sort];

        if (typeof fieldA === "string") {
          return fieldA.localeCompare(fieldB) * order;
        }
        return (fieldA - fieldB) * order;
      });
    }

    // Get shelter map and add shelter info to each pet
    const shelterMap = shelter_Dao.getShelterMap();
    const petsWithShelters = petList.map((pet) => ({
      ...pet,
      shelter: shelterMap[pet.shelterId] || null,
    }));

    res.json({ itemList: petsWithShelters, shelterMap });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = ListAbl;
