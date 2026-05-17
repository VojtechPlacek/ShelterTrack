const baseUri = "";

async function Call(useCase, dtoIn = null, method = "get") {
  const query =
    method === "get" && dtoIn && typeof dtoIn === "object" && Object.keys(dtoIn).length
      ? `?${new URLSearchParams(dtoIn)}`
      : "";
  const url = `${baseUri}/${useCase}${query}`;
  const options =
    method === "get"
      ? { headers: { "Content-Type": "application/json" } }
      : {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dtoIn),
        };

  const response = await fetch(url, options);
  const text = await response.text();
  let data;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  return { ok: response.ok, status: response.status, data };
}

function getErrorMessage(result, defaultMessage) {
  if (!result) return defaultMessage;
  if (typeof result.data === "string") return result.data;
  try {
    return JSON.stringify(result.data);
  } catch {
    return defaultMessage;
  }
}

async function handleResponse(result, defaultMessage) {
  if (!result.ok) {
    throw new Error(getErrorMessage(result, defaultMessage));
  }

  return result.data;
}

export async function getShelters(params = {}) {
  return handleResponse(await Call("shelter/list", params, "get"), "Failed to load shelters");
}

export async function getPets(params = {}) {
  return handleResponse(await Call("pet/list", params, "get"), "Failed to load animals");
}

export async function getPet(id) {
  const dtoIn = typeof id === "object" && id !== null ? id : { id };
  return handleResponse(await Call("pet/get", dtoIn, "get"), "Failed to load animal details");
}

export async function createPet(dtoIn) {
  return handleResponse(await Call("pet/create", dtoIn, "post"), "Failed to create animal");
}

export async function createShelter(dtoIn) {
  return handleResponse(await Call("shelter/create", dtoIn, "post"), "Failed to create shelter");
}

export async function updatePet(dtoIn) {
  return handleResponse(await Call("pet/update", dtoIn, "post"), "Failed to update animal");
}

export async function movePet(id, shelterId) {
  return updatePet({ id, shelterId });
}

export async function updateShelter(dtoIn) {
  return handleResponse(await Call("shelter/update", dtoIn, "post"), "Failed to update shelter");
}

export async function deleteShelter(dtoIn) {
  const payload = typeof dtoIn === "object" && dtoIn !== null ? dtoIn : { id: dtoIn };
  return handleResponse(await Call("shelter/delete", payload, "post"), "Failed to delete shelter");
}
