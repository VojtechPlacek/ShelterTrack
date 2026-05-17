// Data Access Object for Pet operations using file-based storage
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const petFolderPath = path.join(__dirname, "storage", "petList");

// Ensure storage directory exists
function ensureDirectory() {
  if (!fs.existsSync(petFolderPath)) {
    fs.mkdirSync(petFolderPath, { recursive: true });
  }
}

// Get a pet by ID from file storage
function get(petId) {
  try {
    ensureDirectory();
    const filePath = path.join(petFolderPath, `${petId}.json`);
    const fileData = fs.readFileSync(filePath, "utf8");
    return JSON.parse(fileData);
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw { code: "failedToReadPet", message: error.message };
  }
}

// Create a new pet with generated ID and save to file
function create(pet) {
  try {
    ensureDirectory();
    pet.id = crypto.randomBytes(16).toString("hex");
    const filePath = path.join(petFolderPath, `${pet.id}.json`);
    const fileData = JSON.stringify(pet);
    fs.writeFileSync(filePath, fileData, "utf8");
    return pet;
  } catch (error) {
    throw { code: "failedToCreatePet", message: error.message };
  }
}

// Update existing pet in file storage
function update(pet) {
  try {
    ensureDirectory();
    const currentPet = get(pet.id);
    if (!currentPet) return null;
    const newPet = { ...currentPet, ...pet };
    const filePath = path.join(petFolderPath, `${pet.id}.json`);
    const fileData = JSON.stringify(newPet);
    fs.writeFileSync(filePath, fileData, "utf8");
    return newPet;
  } catch (error) {
    throw { code: "failedToUpdatePet", message: error.message };
  }
}

// Method to remove a pet from a file
function remove(petId) {
  try {
    ensureDirectory();
    const filePath = path.join(petFolderPath, `${petId}.json`);
    fs.unlinkSync(filePath);
    return {};
  } catch (error) {
    if (error.code === "ENOENT") return {};
    throw { code: "failedToRemovePet", message: error.message };
  }
}

// Method to list all pets
function list() {
  try {
    ensureDirectory();
    const files = fs.readdirSync(petFolderPath);
    const petList = files.map((file) => {
      const fileData = fs.readFileSync(
        path.join(petFolderPath, file),
        "utf8"
      );
      return JSON.parse(fileData);
    });
    return petList;
  } catch (error) {
    throw { code: "failedToListPets", message: error.message };
  }
}

// Method to list pets by shelterId
function listByShelterId(shelterId) {
  try {
    const petList = list();
    return petList.filter((item) => item.shelterId === shelterId);
  } catch (error) {
    throw { code: "failedToListPetsByShelterId", message: error.message };
  }
}

module.exports = {
  get,
  create,
  update,
  remove,
  list,
  listByShelterId,
};
