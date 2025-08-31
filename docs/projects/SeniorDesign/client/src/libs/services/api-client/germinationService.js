import {instance} from './apiClient';
import {addLogs} from './logsService';

// Get all the materials in the germination stage from the database
export async function getGerminations() {
  const germinations = await instance.get("germinations");
  return germinations;
}

export async function getGermination(germinationId) {
  const germination = await instance.get("germinations/" + germinationId);
  return germination;
}

// Update a material in the germination table via a put request
export async function updateGermination(germinationId, geneticId, numberEmbryos, mediaBatch, dateGermination, location, active, transferDate) {
  await addLogs(`Updated germination with id: ${germinationId}`);
    return await instance.put("germinations/update/" + germinationId, {
      germinationId: germinationId,
      germinationGeneticId: geneticId,
      numberEmbryos: numberEmbryos,
      mediaBatch: mediaBatch,
      dateGermination: dateGermination,
      // transferDate: transferDate, duplicate?
      locationId: location,
      active: active, 
      transferDate: transferDate
    });
  }

// Add a material to the germination table given a previous id, number of embryos, the media batch,
// the date of germination, the location, and whether or not it's active
export async function addGermination(germinationId, geneticId, numberEmbryos, mediaBatch, dateGermination, location, active, transferDate) {
  await addLogs(`Added germination with id: ${germinationId}`);
  return await instance.post("germinations", {
    germinationId: germinationId,
    germinationGeneticId: geneticId,
    numberEmbryos: numberEmbryos,
    mediaBatch: mediaBatch,
    dateGermination: dateGermination,
    // transferDate: transferDate, duplicate?
    locationId: location,
    active: active, 
    transferDate: transferDate
  });
}

// Archive a material in the germination table given an id
export async function archiveGermination(germinationId) {
  await addLogs(`Archived germination with id: ${germinationId}`);
  return await instance.put("germinations/" + germinationId);
}

// Remove a material in the germination table given an id
export async function deleteGermination(germinationId) {
  await addLogs(`Removed germination with id: ${germinationId}`);
  return await instance.delete("germinations/" + germinationId);
}