import {instance} from './apiClient';
import {addLogs} from './logsService';

// Get all embryos in the acclimaion stage from the database
export async function getAcclimations() {
  const acclimations = await instance.get("acclimations");
  return acclimations;
}

export async function getAcclimation(id) {
  const acclimation = await instance.get("acclimations/" + id);
  return acclimation;
}

// Perform a post request on an entry in the acclimation table given it's id
export async function updateAcclimation(acclimationId, acclimationGeneticId, dateAcclimation, location, active, transferDate) {
  addLogs("Updated acclimation with id: " + acclimationId);
    return await instance.put("acclimations/update/" + acclimationId, {
      acclimationId: acclimationId,
      acclimationGeneticId: acclimationGeneticId,
      dateAcclimation: dateAcclimation,
      transferDate: transferDate,
      locationId: location,
      active: active
    });
  }

// Post a new object into the acclimation table given an id, date, location, and whether it's active
export async function addAcclimation(acclimationId, acclimationGeneticId, dateAcclimation, location, active, transferDate) {
  addLogs("Added acclimation with id: " + acclimationId);
  return await instance.post("acclimations", {
    acclimationId: acclimationId,
    acclimationGeneticId: acclimationGeneticId,
    dateAcclimation: dateAcclimation,
    transferDate: transferDate,
    locationId: location,
    active: active
  });
}

// Perform a put request to archive an object from acclimation
export async function archiveAcclimation(acclimationId) {
  addLogs("Archived acclimation with id: " + acclimationId);
  return await instance.put("acclimations/" + acclimationId);
}

// Perform a put request to remove an object from acclimation
export async function deleteAcclimation(acclimationId) {
  addLogs("Removed acclimation with id: " + acclimationId);
  return await instance.delete("acclimations/" + acclimationId);
}