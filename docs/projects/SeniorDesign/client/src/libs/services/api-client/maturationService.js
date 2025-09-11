import { instance } from './apiClient';
import { addLogs } from './logsService';
// Get all the materials in the maturation stage from the database
export async function getMaturations() {
  const maturations = await instance.get("maturations");
  return maturations;
}

export async function getMaturation(id) {
  const maturation = await instance.get("maturations/" + id);
  return maturation;
}

// Update a material in the maturation table via a put request
export async function updateMaturation(maturationId, geneticId, numberOfPlates, mediaBatch, dateMatured, location, active, expectedTransferDate) {
  await addLogs(`Updated maturation with id: ${maturationId}`);
  return await instance.put("maturations/update/" + maturationId, {
    maturationId: maturationId,
    maturationGeneticId: geneticId,
    numberOfPlates: numberOfPlates,
    mediaBatch: mediaBatch,
    dateMatured: dateMatured,
    locationId: location,
    active: active, 
    transferDate: expectedTransferDate
  });
}

// Add a new material to the maturation table given a previous id, the number of plates, the media batch,
// the date of maturation, the location, and whether or not it's active
export async function addMaturation(maturationId, geneticId, numberOfPlates, mediaBatch, dateMatured, location, active, expectedTransferDate) {
  await addLogs(`Added maturation with id: ${maturationId}`);
  return await instance.post("maturations", {
    maturationId: maturationId,
    maturationGeneticId: geneticId,
    numberOfPlates: numberOfPlates,
    mediaBatch: mediaBatch,
    dateMatured: dateMatured,
    locationId: location,
    active: active, 
    transferDate: expectedTransferDate
  });
}

// Archive a maturation
export async function archiveMaturation(maturationId) {
  await addLogs(`Archived maturation with id: ${maturationId}`);
  return await instance.put("maturations/" + maturationId);
}

// Delete a maturation
export async function deleteMaturation(maturationId) {
  await addLogs(`Removed maturation with id: ${maturationId}`);
  return await instance.delete("maturations/" + maturationId);
}