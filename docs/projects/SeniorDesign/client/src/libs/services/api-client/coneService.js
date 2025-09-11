import {instance} from './apiClient';
import {getSingleId} from './idService';
import {addLogs} from './logsService';

// Get all the cones form the cones table in the database
export async function getCones() {
  const cones = await instance.get("cones");
  return cones;
}

//Return single cone by id
export async function getCone(coneId) {
  const cone = await instance.get("cones/" + coneId);
  return cone;
}

// Add a cone to the database via a post request given it's id, motherTreeId, fatherTreeId, rametId, 
// progenyId, geneticId, dateHarvested, location, and whether it's active or not
export async function addCone(id, motherTreeId, fatherTreeId, rametId, geneticId, familyId, progenyId, populationId, dateHarvested, location, active, isCheckedOut, checkedOutBy) {
  const response = await getSingleId(geneticId, familyId, progenyId, populationId, rametId);
  addLogs("Added cone with id: " + id);

  return await instance.post("cones", {
    id: id,
    motherTreeId: motherTreeId ? motherTreeId : null,
    fatherTreeId: fatherTreeId ? fatherTreeId : null,
    coneGeneticId: response.data.id,
    dateHarvested: dateHarvested,
    locationId: location,
    active: active,
    isCheckedOut: isCheckedOut,
    checkedOutBy: checkedOutBy
  });
}

// Use a put request to update a cone in the database
export async function editCone(id, motherTreeId, fatherTreeId, rametId, geneticId, familyId, progenyId, populationId, dateHarvested, location, active, currUserId) {
  const cone = await getCone(id);
  if (cone.data.isCheckedOut && cone.data.checkedOutBy != currUserId.unityId) {
    throw new Error(`Cone with id ${id} is checked out and cannot be edited.`);
  }

  const response = await getSingleId(geneticId, familyId, progenyId, populationId, rametId);

  addLogs("Updated cone with id: " + id);
  return await instance.put(`cones/edit/${id}`, {
    motherTreeId: motherTreeId,
    fatherTreeId: fatherTreeId,
    coneGeneticId: response.data.id,
    dateHarvested: dateHarvested,
    locationId: location,
    active: active,
  });
}

// Archive cone
export async function archiveCone(id, currUserId) {
  const cone = await getCone(id);
  if (cone.data.isCheckedOut && cone.data.checkedOutBy != currUserId.unityId) {
    throw new Error(`Cone with id ${id} is checked out and cannot be archived.`);
  }

  await addLogs("Archived cone with id: " + id);
  await instance.put("cones/" + id);
}

// Delete cone
export async function deleteCone(id) {
  await addLogs("Removed cone with id: " + id);
  await instance.delete("cones/" + id);
}
