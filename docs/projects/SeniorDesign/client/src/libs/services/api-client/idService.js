import {instance} from './apiClient';
import {addLogs} from './logsService';

export async function getIds() {
  const id = await instance.get("genetic-id");
  return id;
}

// Get the genetic id from the genetic id, progeny id, and population id, used for creating trees
export async function getSingleId(geneticId, familyId, progenyId, populationId, rametId) {
  const id = await instance.get("genetic-id/find/" + geneticId + "&" + familyId + '&'+ progenyId + "&" + populationId + "&" + rametId);
  return id;
}

// Used to get the full genetic id, used for translating computer ID to human ID
export async function getId(id) {
  const geneticId = await instance.get("genetic-id/" + id);
  return geneticId;
}

// Get genetic ids by population
export async function getIdsByPopulation(populationId) {
  const ids = await instance.get("genetic-id/find/" + populationId);
  return ids;
}

// Get genetic ids by population and family ID
export async function getIdsByPopulationAndFamily(populationId, familyId) {
  const ids = await instance.get("genetic-id/find/" + populationId + "&" + familyId);
  return ids;
}

export async function getIdsByPopulationAndFamilyAndRamet(populationId, familyId, rametId) {
  const ids = await instance.get("genetic-id/find/" + populationId + "&" + familyId + "&" + rametId);
  return ids;
}

// Gets a list of genetic IDS by population id, family Id, and genetic id
export async function getIdsByPopulationAndFamilyAndGenetic(populationId, familyId, geneticId) {
  const ids = await instance.get("genetic-id/find/" + populationId + "&" + familyId + "&" + geneticId);
  return ids;
}

export async function getIdsByPopulationAndFamilyAndRametAndGenetic(populationId, familyId, rametId, geneticId){
  const ids = await instance.get("genetic-id/find/" + populationId + "&" + familyId + "&" + rametId + "&" + geneticId);
  return ids;
}


// Post a new id to the table given a genetic id, the population, the progeny id, the species, and the
// year planted
export async function addId(geneticId, familyId, progenyId, species, yearPlanted, population, rametId, active, isCheckedOut, checkedOutBy) {
  const id = `P${population}_${familyId}_${rametId}_${geneticId}_${progenyId}`;
  rametId = rametId === '' ? null : rametId;
  await addLogs("Added id with genetic id: " + id);
  return await instance.post("genetic-id", {
    geneticId: geneticId,
    familyId: familyId,
    rametId: rametId,
    populationId: population,
    progenyId: progenyId, 
    species: species,
    yearPlanted: yearPlanted,
    active: active,
    isCheckedOut: isCheckedOut,
    checkedOutBy: checkedOutBy
  });
}

// Update Genetic ID
export async function updateId(dbId, geneticId, familyId, progenyId, species, yearPlanted, population, rametId, currUserId) {
  const id = `P${population}_${familyId}_${rametId}_${geneticId}_${progenyId}`;
  const genId = await getId(geneticId);
  if (genId.data.isCheckedOut  && genId.data.checkedOutBy != currUserId.unityId) {
    throw new Error(`ID with id ${geneticId} is checked out and cannot be updated.`);
  }
  await addLogs("Updated id with geneticId: " + id);

  return await instance.put("genetic-id/edit", {
    dbId: dbId,
    geneticId: geneticId,
    familyId: familyId,
    rametId: rametId,
    populationId: population,
    progenyId: progenyId, 
    species: species,
    yearPlanted: yearPlanted
  });
}

// Archive Genetic ID
export async function archiveId(geneticId, currUserId) {
  const idRecord = await getId(geneticId);
  if (idRecord.data.isCheckedOut && idRecord.data.checkedOutBy != currUserId.unityId) {
    throw new Error(`ID with id ${geneticId} is checked out and cannot be archived.`);
  }
  await addLogs("Archived population with id: " + geneticId);
  await instance.put("genetic-id/" + geneticId);
}
