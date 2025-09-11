import {instance} from './apiClient';
import {addLogs} from './logsService';

// Get the materials from the fieldstation table
export async function getFieldstations() {
  const fieldstations = await instance.get("fieldstations");
  return fieldstations;
}

export async function getFieldstation(id) {
  const fieldstation = await instance.get("fieldstations/" + id);
  return fieldstation;
}

// Update an object in the fieldstation table via a put request
export async function updateFieldstation(fieldStationId, fieldStationGeneticId, datePlanted, location, active) {
  await addLogs(`Updated fieldstation with id: ${fieldStationId}`);
  return await instance.put("fieldstations/update/" + fieldStationId, {
    fieldStationId: fieldStationId,
    fieldStationGeneticId: fieldStationGeneticId,
    datePlanted: datePlanted,
    locationId: location,
    active: active
  });
}

// Add a material to the fieldstation given a previous id, date planted, location, and 
// whether or not it's active
export async function addFieldstation(fieldStationId, fieldStationGeneticId, datePlanted, location, active) {
  await addLogs(`Added fieldstation with id: ${fieldStationId}`);
  return await instance.post("fieldstations", {
    fieldStationId: fieldStationId,
    fieldStationGeneticId: fieldStationGeneticId,
    datePlanted: datePlanted,
    locationId: location,
    active: active
  });
}

export async function archiveFieldstation(fieldStationId) {
  await addLogs(`Archived fieldstation with id: ${fieldStationId}`);
  return await instance.put("fieldstations/" + fieldStationId);
}

export async function deleteFieldstation(fieldStationId) {
  await addLogs(`Removed fieldstation with id: ${fieldStationId}`);
  return await instance.delete("fieldstations/" + fieldStationId);
}