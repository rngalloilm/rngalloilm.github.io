import {instance} from './apiClient';
import {getSingleId} from './idService';
import {addLogs} from './logsService';

// Get all the trees from the database 
export async function getTrees() {
  const trees = await instance.get("trees");
  return trees;
}


// Adds a tree to the database
export async function addTree(progenyId, geneticId, familyId, populationId, rametId, location, gps, active, treeId, isCheckedOut, checkedOutBy) {

  const response = await getSingleId(geneticId, familyId, progenyId, populationId, rametId);
  await addLogs("Added tree with id: " + treeId);
  return await instance.post("trees", {
    treeId: treeId,
    treeGeneticId: response.data.id,
    locationId: location,
    gps: gps,
    active: active,
    isCheckedOut: isCheckedOut,
    checkedOutBy: checkedOutBy
  });
}

//Archive tree
export async function archiveTree(treeId, currUserId) {
  const tree = await getTree(treeId);
  if (tree.data.isCheckedOut && tree.data.checkedOutBy != currUserId.unityId) {
    throw new Error(`Tree with id ${treeId} is checked out and cannot be archived.`);
  }
  await addLogs("Archived tree with id: " + treeId);
  await instance.put("trees/" + treeId);
}

//Delete tree
export async function deleteTree(treeId) {
  await addLogs("Removed tree with id: " + treeId);
  await instance.delete("trees/" + treeId);
}

//Return single tree by id
export async function getTree(treeId) {
  const tree = await instance.get("trees/" + treeId);
  return tree;
}

//Edit tree
export async function editTree(treeId, progenyId, geneticId, familyId, populationId, rametId, location, gps, active, currUserId) {
  const tree = await getTree(treeId);
  if (tree.data.isCheckedOut && tree.data.checkedOutBy != currUserId.unityId) {
    throw new Error(`Tree with id ${treeId} is checked out and cannot be edited.`);
  }
  const response = await getSingleId(geneticId, familyId, progenyId, populationId, rametId);
  await addLogs("Edited tree with id: " + treeId);
  await instance.put("trees/edit/" + treeId, {
    treeGeneticId: response.data.id,
    locationId: location,
    gps: gps,
    active: active
  });
}
