import {instance} from './apiClient';
import {addLogs} from './logsService';

// Get the populations from the database
export async function getPopulations() {
  const populations = await instance.get("populations");
  return populations;
}

// Add a new population to the database
export async function addPopulation(population, active, isCheckedOut, checkedOutBy) {
  await addLogs(`Added population with id: ${population}`);
  return await instance.post("populations", {
    id: population,
    active: active,
    isCheckedOut: isCheckedOut,
    checkedOutBy: checkedOutBy

  });
}

// Archive population
export async function archivePopulation(population, currUserId) {
  const populationData = await instance.get("populations/" + population);
  if (populationData.data.isCheckedOut && population.data.checkedOutBy != currUserId.unityId) {
    throw new Error(`Population with id ${population} is checked out and cannot be archived.`);
  }
  
  await addLogs("Archived population with id: " + population);
  await instance.put("populations/" + population);
}

// Delete population
export async function deletePopulation(population) {
  await addLogs("Removed population with id: " + population);
  await instance.delete("populations/" + population);
}