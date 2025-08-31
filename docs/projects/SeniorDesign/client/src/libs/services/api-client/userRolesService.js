import {instance} from './apiClient';
import {addLogs} from './logsService';

// Get all users in the database with their roles
export async function getUsers() {
  const roles = await instance.get("users/all");
  return roles;
}

// Update the role of a user via a put request
export async function updateUser(unityId, editUnityId, role, firstname, lastname, email) {
    await addLogs("Edited user with unity id: " + editUnityId);
    return await instance.put(`users/${editUnityId}`, {
      unityId: unityId,
      role: role,
      firstName: firstname,
      lastName: lastname,
      email: email
    });
  }

// Add a new user given their unity id and role
export async function addUser(unityId, role, firstname, lastname, email) {
  await addLogs("Added user with unity id: " + unityId);
  return await instance.post("users", {
    unityId: unityId,
    role: role,
    firstName: firstname,
    lastName: lastname,
    email: email
  });
}

export async function deleteUser(unityId) {
  await addLogs("Deleted user with unity id: " + unityId);
  return await instance.delete(`users/${unityId}`);
}
