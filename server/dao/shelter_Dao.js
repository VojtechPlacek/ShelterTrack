// Data Access Object for Shelter operations using file-based storage
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const shelterFolderPath = path.join(__dirname, "storage", "shelterList");

// Ensure storage directory exists
function ensureDirectory() {
  if (!fs.existsSync(shelterFolderPath)) {
    fs.mkdirSync(shelterFolderPath, { recursive: true });
  }
}

// Get a shelter by ID from file storage
function get(shelterId) {
  try {
    ensureDirectory();
    const filePath = path.join(shelterFolderPath, `${shelterId}.json`);
    const fileData = fs.readFileSync(filePath, "utf8");
    return JSON.parse(fileData);
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw { code: "failedToReadShelter", message: error.message };
  }
}

// Create a new shelter with generated ID and save to file
function create(shelter) {
  try {
    ensureDirectory();
    const shelterList = list();
    if (shelterList.some((item) => item.name === shelter.name)) {
      throw {
        code: "uniqueNameAlreadyExists",
        message: "exists shelter with given name",
      };
    }
    shelter.id = crypto.randomBytes(16).toString("hex");
    const filePath = path.join(shelterFolderPath, `${shelter.id}.json`);
    const fileData = JSON.stringify(shelter);
    fs.writeFileSync(filePath, fileData, "utf8");
    return shelter;
  } catch (error) {
    throw { code: "failedToCreateShelter", message: error.message };
  }
}

// Method to update shelter in a file
function update(shelter) {
  try {
    ensureDirectory();
    const currentShelter = get(shelter.id);
    if (!currentShelter) return null;

    if (shelter.name && shelter.name !== currentShelter.name) {
      const shelterList = list();
      if (shelterList.some((item) => item.name === shelter.name)) {
        throw {
          code: "uniqueNameAlreadyExists",
          message: "exists shelter with given name",
        };
      }
    }

    const newShelter = { ...currentShelter, ...shelter };
    const filePath = path.join(shelterFolderPath, `${shelter.id}.json`);
    const fileData = JSON.stringify(newShelter);
    fs.writeFileSync(filePath, fileData, "utf8");
    return newShelter;
  } catch (error) {
    throw { code: "failedToUpdateShelter", message: error.message };
  }
}

// Method to remove a shelter from a file
function remove(shelterId) {
  try {
    ensureDirectory();
    const filePath = path.join(shelterFolderPath, `${shelterId}.json`);
    fs.unlinkSync(filePath);
    return {};
  } catch (error) {
    if (error.code === "ENOENT") {
      return {};
    }
    throw { code: "failedToRemoveShelter", message: error.message };
  }
}

// Method to list shelters in a folder
function list() {
  try {
    ensureDirectory();
    const files = fs.readdirSync(shelterFolderPath);
    const shelterList = files.map((file) => {
      const fileData = fs.readFileSync(
        path.join(shelterFolderPath, file),
        "utf8"
      );
      return JSON.parse(fileData);
    });
    return shelterList;
  } catch (error) {
    throw { code: "failedToListShelters", message: error.message };
  }
}

// Get shelter map
function getShelterMap() {
  const shelterMap = {};
  const shelterList = list();
  shelterList.forEach((shelter) => {
    shelterMap[shelter.id] = shelter;
  });
  return shelterMap;
}

module.exports = {
  get,
  create,
  update,
  remove,
  list,
  getShelterMap,
};
