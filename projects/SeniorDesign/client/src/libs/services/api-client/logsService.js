import {instance} from './apiClient';

// Get all the logs in the logs table in the database
export async function getLogs() {
  const logs = await instance.get("logs");
  return logs;
}

// Add a new log to the database with the date of the action and
// what action was performed
export async function addLogs(actionDone) {
  return await instance.post("logs", {
    action: actionDone
  });
}