import {instance} from './apiClient';
import {addLogs} from './logsService';
// Get all the species in the database
export async function getSpecies() {
  const species = await instance.get("species");
  return species;
}

//get species by speciesName
export async function getSpeciesByName(speciesName) {
  const species = await instance.get(`species/${speciesName}`);
  return species;
}

// Add a new species given it's name and the shorthand abbreviation
export async function addSpecies(speciesName, speciesShorthand, active, isCheckedOut, checkedOutBy) {
  await addLogs(`Added species with name: ${speciesName}`);
  return await instance.post("species", {
    species: speciesName,
    shorthand: speciesShorthand,
    active: active,
    isCheckedOut: isCheckedOut,
    checkedOutBy: checkedOutBy
  });
}

//Archive species
export async function archiveSpecies(species, currUserId) {
  const speciesToArchive = await getSpeciesByName(species);
  if (speciesToArchive.data.isCheckedOut && species.data.checkedOutBy != currUserId.unityId) {
    throw new Error(`Species with id ${species} is checked out and cannot be archived.`);
  }
  await addLogs("Archived species with name: " + species);
  await instance.put("species/" + species);
}

//Delete species
export async function deleteSpecies(species) {
  await addLogs("Removed species with name: " + species);
  await instance.delete("species/" + species);
}

// Update species shorthand given its name and the shorthand abbreviation
export async function updateSpecies(speciesName, speciesShorthand, currUserId) { 

  const speciesData = await getSpeciesByName(speciesName);
  if (speciesData.data.isCheckedOut && speciesData.data.checkedOutBy != currUserId.unityId) {
    throw new Error(`Species with id ${speciesName} is checked out and cannot be updated.`);
  }
  await addLogs(`Updating species with name: ${speciesName}`);
  
  return await instance.put("species/edit/" + speciesName, {
    species: speciesName,
    shorthand: speciesShorthand,
    active: true
  });
}
