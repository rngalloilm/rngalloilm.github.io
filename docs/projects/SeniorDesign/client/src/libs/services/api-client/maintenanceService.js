import { instance } from "./apiClient";
import { addLogs } from "./logsService";
// Get all the materials in the maintenance stage from the database
export async function getMaintenances() {
  const maintenances = await instance.get("maintenances");
  return maintenances;
}

export async function getMaintenance(id) {
  const maintenance = await instance.get(`maintenances/${id}`);
  return maintenance;
}

// Update a material in the maintenance table via a put request
export async function updateMaintenance(
  maintenanceId,
  geneticId,
  numberOfPlates,
  mediaBatchCurr,
  dateCurr,
  mediaBatchPrev,
  datePrev,
  transferDate,
  location,
  active
) {
  await addLogs(`Updated maintenance with id: ${maintenanceId}`);
  return await instance.put("maintenances/update/" + maintenanceId, {
    maintenanceId: maintenanceId,
    maintenanceGeneticId: geneticId,
    numberOfPlates: numberOfPlates,
    mediaBatchCurr: mediaBatchCurr,
    dateCurr: dateCurr,
    mediaBatchPrev: mediaBatchPrev,
    datePrev: datePrev,
    transferDate,
    locationId: location,
    active: active
  });
}

// Post a new material to the maintenance table given a previous id, the number of plates, the current media batch,
// the current date, the previous media batch, the previous maintenance date, the location,
// and whether or not it's active
export async function addMaintenance(
  maintenanceId,
  geneticId,
  numberOfPlates,
  mediaBatchCurr,
  dateCurr,
  mediaBatchPrev,
  datePrev,
  transferDate,
  location,
  active
) {
  await addLogs(`Added maintenance with id: ${maintenanceId}`);
  return await instance.post("maintenances", {
    maintenanceId: maintenanceId,
    maintenanceGeneticId: geneticId,
    numberOfPlates: numberOfPlates,
    mediaBatchCurr: mediaBatchCurr,
    dateCurr: dateCurr,
    mediaBatchPrev: mediaBatchPrev,
    datePrev: datePrev,
    transferDate,
    locationId: location,
    active: active
  });
}

// Archive a maintenance
export async function archiveMaintenance(id) {
  await addLogs(`Archived maintenance with id: ${id}`);
  return await instance.put(`maintenances/${id}`);
}

// Delete a maintenance
export async function deleteMaintenance(id) {
  await addLogs(`Removed maintenance with id: ${id}`);
  return await instance.delete(`maintenances/${id}`);
}