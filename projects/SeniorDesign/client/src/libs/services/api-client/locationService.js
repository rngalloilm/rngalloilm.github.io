import {instance} from './apiClient';
import {addLogs} from './logsService';

// Get all the locations from the location table in the database
export async function getLocations() {
  const locations = await instance.get("locations");
  return locations;
}

//get location from name
export async function getLocationByName(locationName) {
  const location = await instance.get(`locations/${locationName}`);
  console.log("Location: " + location);
  return location;
}


// Add a new location that materials can be located in to the database given a name,
// and the shorthand abbreviation
export async function addLocation(locationName, locationShorthand, active, isCheckedOut, checkedOutBy) {
  await addLogs(`Added location with name: ${locationName}`);
  return await instance.post("locations", {
    location: locationName,
    shorthand: locationShorthand,
    active: active,
    isCheckedOut: isCheckedOut,
    checkedOutBy: checkedOutBy
  });
}

// Edit a location
export async function editLocation(originalLocationName, locationName, locationShorthand, active, currUserId) {
  const location = await getLocationByName(originalLocationName);
  if (location.data.isCheckedOut && location.data.checkedOutBy != currUserId.unityId) {
    throw new Error(`Location ${originalLocationName} is checked out and cannot be edited.`);
  }
  await addLogs(`Edited location: ${originalLocationName} to ${locationName}`);
  return await instance.put("locations/edit/" + originalLocationName, {
    location: locationName,
    shorthand: locationShorthand,
    active: active
  });
}

// Archive a location
export async function archiveLocation(locationName, currUserId) {
  const location = await getLocationByName(locationName);
  if (location.data.isCheckedOut && location.data.checkedOutBy != currUserId.unityId) {
    throw new Error(`Location ${locationName} is checked out and cannot be archived.`);
  }
  await addLogs("Archived Location with name:" + locationName);
  await instance.put("locations/" + locationName);
}

// Delete a location
export async function deleteLocation(locationName) {
  await addLogs("Removed Location with name:" + locationName);
  await instance.delete("locations/" + locationName);
}