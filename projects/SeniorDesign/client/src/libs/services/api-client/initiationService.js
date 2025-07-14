import {instance} from './apiClient';
import {addLogs} from './logsService';

// Get the materials in the initiation stage in the database
export async function getInitiations() {
  const initiations = await instance.get("initiations");
  return initiations;
}

export async function getInitiation(initiationId) {
  const initiation = await instance.get("initiations/" + initiationId);
  return initiation;
}

// Update a material in the initiation table via a put request
export async function editInitiation(initiationId, geneticId, seedsAndEmbryos, mediaBatch, numberOfPlates, dateMade, location, active, transferDate) {
  await addLogs(`Updated initiation with id: ${initiationId}`);
  return await instance.put("initiations/edit/" + initiationId, {
    initiationId: initiationId,
    initiationGeneticId: geneticId,
    seedsAndEmbryos: seedsAndEmbryos,
    mediaBatch: mediaBatch,
    numberOfPlates: numberOfPlates,
    dateMade: dateMade,
    transferDate: transferDate,
    locationId: location,
    active: active
  });
}

// Add a new material to the initiation table given the seeds and embryos, media batch, number of plates,
// the date made, the location, and whether or not it's active
export async function addInitiation(initiationId, geneticId, seedsAndEmbryos, mediaBatch, numberOfPlates, dateMade, location, active, transferDate) {
  await addLogs(`Added initiation with id: ${initiationId}`);
  return await instance.post("initiations", {
    initiationId: initiationId,
    initiationGeneticId: geneticId,
    seedsAndEmbryos: seedsAndEmbryos,
    mediaBatch: mediaBatch,
    numberOfPlates: numberOfPlates,
    dateMade: dateMade,
    transferDate: transferDate,
    locationId: location,
    active: active
  });
}

// Archive a material in the initiation table via a put request
export async function archiveInitiation(initiationId) {
  await addLogs(`Archived initiation with id: ${initiationId}`);
  await instance.put("initiations/" + initiationId);
}

// Remove a material in the initiation table via a delete request
export async function deleteInitiation(initiationId) {
  await addLogs(`Removed initiation with id: ${initiationId}`);
  await instance.delete("initiations/" + initiationId);
}