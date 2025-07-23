import {instance} from './apiClient';
import { getSingleId } from './idService';
import {addLogs} from './logsService';

// Get the ramets from the database
export async function getRamets() {
  const ramets = await instance.get("ramets");
  return ramets;
}

// Add a ramet to the database given a mother tree id, the progeny id, the genetic id, the location, the gps
// coordinates, and whether or not it's active
export async function addRamet(id, motherTreeId, geneticId, familyId, progenyId, populationId, rametId, location, gps, transferDate, active, isCheckedOut, checkedOutBy) {
  const response =  await getSingleId(geneticId, familyId, progenyId, populationId, rametId);
  await addLogs("Added ramet with id: " + id);
  return await instance.post("ramets", {
    id: id,
    motherTreeId: motherTreeId,
    locationId: location,
    rametGeneticId: response.data.id,
    gps: gps,
    transferDate: transferDate,
    active: active,
    isCheckedOut: isCheckedOut,
    checkedOutBy: checkedOutBy
  });
}

// Update a ramet via a put request
export async function updateRamet(
  id, 
  motherTreeId, 
  progenyId, 
  geneticId,
  familyId,
  rametId,
  population,
  location, 
  gps,
  transferDate,
  active,
  currUserId
  ) {

  const rametData = await instance.get("ramets/" + rametId);
  if (rametData.data.isCheckedOut && rametData.data.checkedOutBy != currUserId.unityId) {
    throw new Error(`Ramet with id ${rametId} is checked out and cannot be updated.`);
  }
  const response = await getSingleId(geneticId, familyId, progenyId, population, rametId);
  await addLogs("Updated ramet with id: " + id);
  return await instance.put("ramets/edit/" + id, {
    motherTreeId: motherTreeId,
    locationId: location,
    rametGeneticId: response.data.id,
    gps: gps,
    transferDate: transferDate,
    active: active
  });
}

// Archive ramet
export async function archiveRamet(ramet, currUserId) {
  const rametData = await instance.get("ramets/" + ramet);
  if (rametData.data.isCheckedOut && ramet.data.checkedOutBy != currUserId.unityId) {
    throw new Error(`Ramet with id ${ramet} is checked out and cannot be archived.`);
  }
  
  await addLogs("Archived ramet with id: " + ramet);
  await instance.put("ramets/" + ramet);
}

// Delete ramet
export async function deleteRamet(ramet) {
  await addLogs("Removed ramet with id: " + ramet);
  await instance.delete("ramets/" + ramet);
}
