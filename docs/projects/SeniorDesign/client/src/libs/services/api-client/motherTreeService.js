import {instance} from './apiClient';

// Get all the trees in the mother tree table from the database
export async function getMotherTrees() {
  const motherTrees = await instance.get("motherTrees");
  return motherTrees;
}

// Add a tree to the mother tree table given a tree id, the species, the location, and the gps coordinates
export async function addMotherTree(treeId, newSpecies, newLocation, newGPS) {
  instance.post("motherTrees", {
    id: treeId,
    species: newSpecies,
    location: newLocation,
    gps: newGPS
  });
}

// Spring 25: no such route is defined or required in routes.js. The actual tree operations are handled by tree.route.js and treeService.js.
// Redundant file?