import {instance} from './apiClient';
import { getSingleId } from './idService';
import {addLogs} from './logsService';

// Returns the seed materials in the database
export async function getSeeds() {
  const seeds = await instance.get("seeds");
  return seeds;
}

//Return single seed by id
export async function getSeed(seedId) {
  const seed = await instance.get("seeds/" + seedId);
  return seed;
}

// Add a new seed material to the database given a mother tree id, a father tree id, a progeny id,
// geentic id, origin, quantityt, dateMade, location, active
export async function addSeed(seedId, motherId, coneId, fatherTreeId, geneticId, 
  familyId, progenyId, population, ramet,  origin, quantity, dateMade, transferDate, location, active, isCheckedOut, checkedOutBy) {
    const response = await getSingleId(geneticId, familyId, progenyId, population, ramet);
    await addLogs("Added seed with id: " + seedId);
    console.log("Added seed with id: " + seedId);

    return await instance.post("seeds", {
    id: seedId,
    motherTreeId: motherId ? motherId : null,
    coneId: coneId ? coneId : null,
    fatherTreeId: fatherTreeId ? fatherTreeId : null,
    seedGeneticId: response.data.id,
    origin,
    quantity,
    dateMade,
    locationId: location,
    transferDate,
    active: active,
    isCheckedOut: isCheckedOut,
    checkedOutBy: checkedOutBy
  });
}

// Update a seed material via a put request
export async function editSeed(seedId, motherId, coneId, fatherTreeId, geneticId, 
  familyId, progenyId, population, ramet,  origin, quantity, dateMade, transferDate, location, currUserId) {
  const seed = await getSeed(seedId);
  if (seed.data.isCheckedOut && seed.data.checkedOutBy != currUserId.unityId) {
    throw new Error(`Seed with id ${seedId} is checked out and cannot be edited.`);
  }

  const response = await getSingleId(geneticId, familyId, progenyId, population, ramet);

  await addLogs("Updated seed with id: " + seedId);
  return await instance.put(`seeds/edit/${seedId}`, {
    motherTreeId: motherId, 
    fatherTreeId: fatherTreeId,
    coneId: coneId,
    seedGeneticId: response.data.id,
    origin: origin,
    quantity,
    dateMade,
    locationId: location,
    transferDate
  });
}

// Archive a seed material via a put request
export async function archiveSeed(seedId, currUserId) {
  const seed = await getSeed(seedId);
  if (seed.data.isCheckedOut && seed.data.checkedOutBy != currUserId.unityId) {
    throw new Error(`Seed with id ${seedId} is checked out and cannot be archived.`);
  }

  await addLogs("Archived seed with id: " + seedId);
  await instance.put("seeds/" + seedId);
}

// Delete a seed material
export async function deleteSeed(seedId) {
  await addLogs("Removed seed with id: " + seedId);
  await instance.delete("seeds/" + seedId);
}